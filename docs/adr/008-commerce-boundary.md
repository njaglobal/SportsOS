# ADR 008 — Commerce Boundary

## Status

Accepted

## Date

2026-09-08

## Context

SportsOS collects paid entry fees and must support payment, refund, and
settlement workflows (R16). The participant who competes and the payer who
pays are different concepts (R18) — a guardian may pay for a minor. Currency
must not be hard-coded to PHP (R13). Payment providers (Stripe, GCash, Maya,
banks) must be swappable without rewriting domain logic (R24). Registration
logic must not be coupled to money movement.

## Decision

1. **Commerce is its own bounded context**, owning `Payment` and the
   append-only `PaymentLedgerEntry`. It links to Registration and Persons by
   typed ID only.
2. **Participant and payer are separate.** `Registration.participantId`
   (Athlete/Team) and `Registration.payerPersonId` (Person) are distinct
   fields. `Payment.payerPersonId` matches the registration's payer.
3. **Money is multi-currency.** `Money` carries an ISO 4217 `currency` code
   and integer minor units. No hard-coded PHP (R13).
4. **Financial operations are append-only auditable.** Every charge, refund,
   settlement, and adjustment produces a `PaymentLedgerEntry`. `Payment.status`
   is a projection of the ledger. Refunds are new entries, not mutations.
5. **Registration and Commerce communicate via events**, not direct calls:
   `RegistrationSubmitted` → Commerce creates a payment obligation;
   `PaymentCaptured` → Registration advances status. This keeps payment
   providers swappable (R24).
6. A future `PaymentGatewayPort` abstracts provider interactions; webhook
   signature verification happens in the adapter.

See `commerce-model.md`, `registration-model.md`.

## Consequences

**Positive:**
- Money concerns are isolated and auditable.
- Payment providers are swappable via adapters.
- Minor/guardian and sponsor payment flows are natural.
- Multi-currency from day one.
- Registration logic is free of payment SDK coupling.

**Negative:**
- Event-driven coordination between Registration and Commerce adds
  asynchronous complexity (idempotency, retries) — required for correctness.
- Settlement/payout workflows are future (ledger shape supports them now).

## Alternatives considered

- **Registration owns payments.** Rejected: couples registration to payment
  providers and money logic; violates R24 and the boundary principle.
- **Mutable payment status with no ledger.** Rejected: unauditable; violates
  R16.
- **Hard-coded PHP.** Rejected: violates R13 and blocks expansion.
- **Single field for participant+payer.** Rejected: violates R18; cannot
  model guardian/sponsor payment.

## Compliance

- `Money.currency` is ISO 4217; amounts are integer minor units.
- `Payment.payerPersonId` is distinct from `Registration.participantId`.
- `PaymentLedgerEntry` is append-only.
- Registration ↔ Commerce communicate via `EventBus` events.
