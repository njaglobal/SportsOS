# ADR 006 — Rewards Ledger

## Status

Accepted

## Date

2026-09-08

## Context

Sports Points are a spendable reward currency. They must be auditable, fraud-
resistant, and tied to event verification (R7, R17). They must be **separate**
from achievements/championships (R6), which are historical recognition, not
spendable. A mutable "balance" column would be unauditable and race-prone.

## Decision

1. The **`RewardsLedgerEntry` is the source of truth** for Sports Points. It
   is **append-only**: entries are never modified or deleted.
2. `RewardsBalance` is a **derived projection** of the ledger, recomputable
   from it. It is never mutated directly; there is no "update balance"
   operation.
3. Entry kinds: `issuance` (positive), `redemption` (negative), `adjustment`
   (negating reversal or correction), `expiry` (negative).
4. **Issuance is conditional on verification.** An issuance starts
   `verified: false`; it counts toward `pending`, not `available`. After
   event verification/fraud checks, it becomes `verified: true` and counts
   toward `available`. Voiding a result appends a negating `adjustment`
   (R17).
5. **Achievements and rewards are separate.** Issuing an Achievement does not
   issue points; points issuance is an independent decision in the Rewards
   context (R6).
6. Reversals/clawbacks are new entries, never mutations.

See `rewards-model.md`, `results-achievements-model.md`.

## Consequences

**Positive:**
- Full auditability: any balance is reconstructable by replaying the ledger.
- Fraud control via verified/unverified issuance gating.
- No race on a mutable balance column (reconciliation is arithmetic).
- Clean separation from achievements.

**Negative:**
- Balance queries require aggregating the ledger (mitigated by a cached
  projection that is rebuildable).
- Redemption under concurrency requires a lock/version check in the adapter
  to prevent over-spending.

## Alternatives considered

- **Mutable balance column.** Rejected: unauditable, race-prone, violates R7.
- **Achievements that confer spendable points.** Rejected: violates R6;
  achievements are recognition, not currency.
- **Single ledger for both financial and rewards.** Rejected: different
  domains, different consumers, different verification rules. Keep separate
  append-only ledgers (Payment ledger, Rewards ledger).

## Compliance

- `RewardsLedgerEntry` is append-only by construction.
- `RewardsBalance.available` excludes unverified issuances.
- No code path mutates a ledger entry.
- Achievements and rewards issuance are independent.
