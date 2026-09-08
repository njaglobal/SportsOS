# Rewards Model

> Sports Points rewards accounting with an append-only ledger as source of
> truth. See ADR-006, R7, R17.

## Ledger is source of truth (R7)

`RewardsLedgerEntry` is the **authoritative** record of Sports Points. A
`RewardsBalance` is a **derived projection** — recomputable from the ledger,
never mutated directly. There is no "update balance" operation; there is only
"append a ledger entry."

```typescript
interface RewardsLedgerEntry {
  id: Id<"RewardsLedgerEntry">;
  tenantId: Id<"Tenant">;
  athleteId: Id<"Athlete">;
  kind: LedgerEntryKind;
  points: number;           // positive for issuance, negative for redemption
  sourceResultId: Id<"Result"> | null;
  verified: boolean;
  verificationRef: string | null;
  recordedAt: ISODateString;
}

type LedgerEntryKind = "issuance" | "redemption" | "adjustment" | "expiry";

interface RewardsBalance {
  athleteId: Id<"Athlete">;
  tenantId: Id<"Tenant">;
  available: number;
  pending: number;
  asOfLedgerEntryId: string;
}
```

## Accounting rules

1. **Append-only.** Ledger entries are never modified or deleted. A reversal
   is a new `adjustment` entry with negating points, referencing the original.
2. **Integer points.** No fractional points.
3. **Issuance is conditional.** An `issuance` entry is created with
   `verified: false` initially. It becomes `verified: true` after event
   verification/fraud checks. Only verified issuances count toward
   `available` in the balance projection.
4. **Redemption requires available balance.** A `redemption` entry is only
   appended if the athlete's verified available balance covers it. This check
   is performed by an application service reading the derived balance (and
   re-verifying against the ledger under a lock in the adapter).
5. **Balance is a projection.** `available = sum(verified issuance) -
   sum(redemption) - sum(adjustment)`. `pending = sum(unverified issuance)`.
   The projection carries `asOfLedgerEntryId` for consistency.

```mermaid
flowchart LR
  Result["Result confirmed"] -->|ResultConfirmed event| Rewards["Rewards context"]
  Rewards -->|append issuance (verified=false)| Ledger[(Ledger)]
  Verification["Event verification / fraud check"] -->|verify| Ledger
  Ledger -->|project| Balance["RewardsBalance"]
  Redemption["Redemption request"] -->|append redemption| Ledger
```

## Fraud controls & event verification (R17)

Issuance is gated:

- A `ResultConfirmed` event triggers a **pending** issuance.
- A verification step (official confirmation, anti-fraud rules, event
  integrity checks) flips `verified` to true (or creates a negating
  `adjustment` if the result is later voided).
- `verificationRef` links to the verification record/official.

This prevents rewarding fraudulent or disputed results and allows voiding
rewards without mutating history (append a negating entry).

## Achievements vs Rewards (R6, recap)

Achievements are historical recognition; rewards are spendable points. A
champion gets an `Achievement` (permanent, verifiable) and **may** get a
Sports Points `issuance` (spendable). The two are independent decisions in
independent contexts. See `results-achievements-model.md`.

## Marketplace & redemption (future)

The reward marketplace is a future consumer of the Rewards context. It reads
the derived balance and appends `redemption` entries. It does not own the
ledger. Redemption items, catalogs, and fulfillment are future aggregates in
a Marketplace context, not built this sprint.

## Tenant isolation

Every ledger entry carries `tenantId`. Balance projections are per-athlete
within a tenant. Cross-tenant reward access is never implicit (R14).

## Expiry

Points may expire (e.g. season-bound rewards). Expiry is an `expiry` ledger
entry (negative points) appended at the expiry time. It is not a deletion of
the original issuance. This keeps the ledger complete and auditable.
