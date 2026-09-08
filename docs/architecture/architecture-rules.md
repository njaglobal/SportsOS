# Architecture Rules

> Mandatory architectural principles and invariants for SportsOS.
> Each rule is numbered to match the sprint brief and is normative: a PR that
> violates a rule must not be merged without an ADR superseding it.

## R1. One Person may hold many platform roles.

A `Person` is the natural/legal identity. Roles (`athlete`, `coach`,
`organizer`, `official`, `team_manager`, `guardian`) are separate, scoped
projections. A Person may hold several roles simultaneously, in different
scopes (global, organization, team, event). See `person-role-model.md`.

## R2. One Person has at most one Sports ID.

The Sports ID is a permanent, platform-issued identifier. It is issued once
and never reissued to a different person. See `identity-model.md`, ADR-002.

## R3. Athlete identity is independent of sport.

An `Athlete` is a single role projection of a `Person`. There is one Athlete
per Person, not one Athlete per sport. Sport participation is a separate
many-to-many relationship. See ADR-003.

## R4. Athlete ↔ Sport is many-to-many.

`AthleteSportParticipation` links an Athlete to many Sports (and Disciplines),
and a Sport to many Athletes. A single athlete may participate in and win
across multiple sports throughout their lifetime.

## R5. Historical competition records must be auditable and protected from destructive mutation.

`CompetitionResult` entries are append-only. Corrections produce a new entry
with `status: "amended"` referencing the prior entry; the original is never
overwritten or deleted. See `results-achievements-model.md`,
`audit-integrity.md`.

## R6. Achievements/championships are separate from spendable rewards.

`Achievement` (champion, medalist, record holder) is a verifiable historical
record. `RewardsLedgerEntry` (Sports Points) is a spendable accounting entry.
Issuing an achievement does not issue points, and vice versa. See ADR-006.

## R7. Sports Points must use an append-oriented ledger as source of truth.

`RewardsLedgerEntry` is the source of truth. `RewardsBalance` is a **derived
projection**, never authoritative and never mutated directly. See ADR-006.

## R8. QR credentials identify a person but must not contain sensitive profile data.

A `QrCredential` carries only an opaque `payloadToken` that resolves to the
person server-side. It must not embed name, DOB, contact, or health data.
See ADR-007.

## R9. Permanent Sports ID QR and temporary/dynamic event credentials are separate concepts.

`QrCredentialKind` discriminates `permanent_sports_id` (long-lived, person-scoped)
from `event_credential` (short-lived, event-scoped, rotatable). See
`qr-credentials-model.md`.

## R10. QR identity, biometric/device authentication, and identity verification are separate concepts.

- QR identity = "which person does this credential point to"
- Biometric/device auth = "is this device unlocked by its owner"
- Identity verification = "has this person been verified (self / document / verified)"

These are independent and compose; none implies another. See
`qr-credentials-model.md`.

## R11. Competition architecture must support team, individual, timed, measured, and multi-participant events.

`CompetitionEvent` carries a `format` (single_elimination, round_robin,
timed_finals, measured_final, judged, …) and a `participantKind`
(individual | team). The `measure` field drives scoring semantics. Formats are
extensible without schema change. See ADR-005.

## R12. Geography must not hard-code Philippine administrative structures.

Geography uses a generic, typed-place model with a country code (ISO 3166-1)
and an ordered list of named administrative levels. No `barangay`/`municipality`
columns. See `geography-localization.md`.

## R13. Currency must not hard-code PHP.

`Money` carries an ISO 4217 `currency` code. Amounts are integer minor units.
See `commerce-model.md`.

## R14. Multi-tenancy and organization isolation must be explicit.

Every tenant-scoped entity carries a `tenantId`. Repositories filter by
`tenantId` by default. Cross-tenant access is never implicit. See
`tenancy.md`, ADR-004.

## R15. Authorization must be permission-based, not hard-coded role checks.

Authorization evaluates `Permission` values against a `PersonRole` scope. Code
must not branch on role names (`if role === 'organizer'`). See
`authorization.md`.

## R16. Financial operations must be auditable.

Every charge, refund, settlement, and adjustment produces a
`PaymentLedgerEntry`. The ledger is append-only. See `commerce-model.md`,
`audit-integrity.md`.

## R17. Reward issuance must support fraud controls and event verification.

`RewardsLedgerEntry` carries `verified` and `verificationRef`. Issuance for an
event result must be verified before the balance projection counts it as
available. See `rewards-model.md`.

## R18. Registration participant and payment payer must be separate concepts.

A `Registration` has a `participantId` (Athlete or Team) and a separate
`payerPersonId`. A guardian may pay for a minor athlete. See
`registration-model.md`, ADR-008.

## R19. Minors/guardian relationships must be supportable.

A `Person` may have a `guardianId` pointing to another `Person`. Guardian
consent flows are modeled on this relationship. See `identity-model.md`.

## R20. Historical sports records must not disappear because an account/entity is deleted.

Deletion of a Person or account is **soft** and revokes credentials; it never
deletes historical results, achievements, or ledger entries. Results reference
the Athlete (which references the Person); the Person is retained in an
immutable identity archive. See `audit-integrity.md`.

## R21. Domain/application logic must be reusable across web and future Android/iOS delivery.

Domain and application layers have zero imports from browser, React, React
Native, Supabase, Stripe, or any platform SDK. See `dependency-rules.md`,
ADR-009.

## R22. Native/platform APIs must remain behind adapters.

Camera, QR scanner, push, secure storage, biometrics, file upload, deep links,
sharing, location, offline sync — all are ports in `src/ports/native-ports.ts`,
implemented by adapters per platform. See `client-platforms.md`,
`mobile-strategy.md`.

## R23. Architecture must allow future limited offline workflows for event operations without implementing them now.

The `OfflineSyncPort` and queued-operation model exist to support future
offline event check-in and scoring. No offline implementation is built this
sprint. See `offline-resilience.md`.

## R24. Infrastructure may later be replaced without rewriting core business logic.

Ports are owned by the application/domain layer. Adapters implement them.
Swapping Supabase for another Postgres provider, or Stripe for another
processor, requires only a new adapter. See `dependency-rules.md`.

## Enforcement

- **TypeScript path aliases** keep layers navigable (`@domain`, `@app`, `@ports`,
  `@adapters`, `@shared`).
- **ESLint `import/no-cycle`** prevents circular dependencies.
- **Code review** must reject any `@domain` or `@app` import of `@adapters` or
  any platform SDK.
- A future `eslint-plugin-boundaries` or `dependency-cruiser` rule set may
  automate layer enforcement; see ADR backlog.
