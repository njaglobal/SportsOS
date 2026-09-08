# Audit & Integrity

> Audit strategy and historical record integrity. See R5, R16, R17, R20.

## Audit strategy

SportsOS treats audit as a first-class concern. Two append-only ledgers and a
set of immutable historical records form the audit backbone:

| Record | Owner | Mutability |
|---|---|---|
| `PaymentLedgerEntry` | Commerce | Append-only |
| `RewardsLedgerEntry` | Rewards | Append-only |
| `CompetitionResult` | Results | Append-only (amendments = new entries) |
| `Achievement` | Results | Immutable once verified |
| `IdentityVerification` | Credentials | Append-only (level upgrades are new records) |
| `Person` (identity archive) | Identity | Soft-delete only; never hard-deleted |

## Append-only means never mutate or delete

For both ledgers and results:

- A **correction** is a **new entry** that references the prior one, not an
  update. (Results: `amended` status with a `supersedes` link. Ledgers: a
  negating `adjustment` entry.)
- A **void** is a terminal status / new entry, not a delete.
- **Reversals** (refunds, reward voiding) are new entries with opposite
  signed values.

This means any point-in-time state can be reconstructed by replaying the
append-only sequence from the beginning — the definition of an audit log.

## What gets audited (event log)

In addition to the append-only records, the platform publishes domain events
that an audit projector consumes (future). Events worth retaining:

- `SportsIdIssued`, `SportsIdRevoked`
- `PersonRoleGranted`, `PersonRoleRevoked`
- `RegistrationSubmitted`, `RegistrationVerified`, `RegistrationWithdrawn`
- `PaymentCaptured`, `PaymentRefunded`, `PaymentSettled`
- `ResultProvisional`, `ResultConfirmed`, `ResultAmended`, `ResultVoided`
- `AchievementVerified`
- `RewardsIssued`, `RewardsVerified`, `RewardsRedeemed`, `RewardsExpired`
- `QrCredentialIssued`, `QrCredentialRotated`, `QrCredentialRevoked`
- `AuthorizationDenied` (permission check failures, for sensitive actions)

The event log is an audit **projection**, not the source of truth. The
append-only records are the source of truth. The event log makes querying
audit history convenient.

## Deletion safety (R20)

"Deleting" an account is a **soft** operation:

1. The `User` (auth subject) is disabled.
2. Active `QrCredential`s are revoked.
3. The `Person` is flagged archived; the record is **retained** in an
   immutable identity archive.
4. Historical `CompetitionResult`, `Achievement`, and ledger entries
   referencing the Person's `Athlete` are **untouched**.

This guarantees that historical sports records never disappear because an
account was deleted. A person's sporting history outlives their login.

## Financial integrity (R16)

Every money movement produces a `PaymentLedgerEntry`. The current
`Payment.status` is a projection of the ledger. Financial reconciliation
replays the ledger; it never relies on a mutable "current balance" column.
See `commerce-model.md`.

## Reward integrity (R17)

Rewards issuance is gated by verification. Pending issuances do not count as
available. Voiding a result appends a negating `adjustment` to the rewards
ledger — rewards are clawed back without mutating history. See
`rewards-model.md`.

## Result integrity (R5)

Confirmed results are immutable. Amendments chain via `supersedes`/`supersededBy`
links, preserving the full history. See `results-achievements-model.md`.

## Tenant isolation in audit

All audit records and append-only ledgers carry `tenantId`. Cross-tenant
audit access requires explicit escalation. See `tenancy.md`.

## What is NOT built this sprint

- No audit event projector or audit query UI.
- No event store implementation.
- No reconciliation jobs.
The **shapes** (append-only records, immutable results, soft-delete) are
defined so that Sprint 1 implementations inherit integrity by construction.
