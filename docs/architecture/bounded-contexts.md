# Bounded Contexts

> SportsOS is decomposed into bounded contexts aligned to the product vision.
> Each context owns its aggregates, value objects, and domain events, and
> communicates with other contexts only through the application-layer
> `EventBus` (see `dependency-rules.md`).

## Context map

```mermaid
flowchart LR
  Identity["Identity & Sports ID"]
  Roles["Person Roles & Authorization"]
  Sports["Sports Catalog"]
  Orgs["Organizations & Tenancy"]
  Competition["Competition & Events"]
  Registration["Registration & Eligibility"]
  Commerce["Commerce / Payments"]
  Results["Results & Achievements"]
  Rewards["Rewards Ledger"]
  Credentials["QR Credentials & Verification"]

  Identity --> Roles
  Sports --> Competition
  Orgs --> Competition
  Orgs --> Registration
  Competition --> Registration
  Registration --> Commerce
  Competition --> Results
  Registration --> Results
  Results --> Rewards
  Identity --> Credentials
  Credentials --> Competition
```

Arrows denote "collaborates with / publishes events consumed by." No context
imports another context's internal types directly; they communicate via
published domain events and shared identifiers from the shared kernel.

## Contexts

### 1. Identity & Sports ID

**Owns:** `Person`, `SportsId`, minor/guardian relationship, identity archive.
**Responsibility:** the permanent, platform-issued identity that survives
account lifecycle changes. Issues Sports IDs. Never deletes a Person's
historical identity. See `identity-model.md`, ADR-002.

### 2. Person Roles & Authorization

**Owns:** `PersonRole`, `RoleScope`, `Permission`, permission evaluation.
**Responsibility:** grants and revokes roles, evaluates permissions against a
scope. Permission-based, not role-name based. See `person-role-model.md`,
`authorization.md`.

### 3. Sports Catalog

**Owns:** `Sport`, `Discipline`, `CompetitionMeasure`.
**Responsibility:** the canonical catalog of sports, disciplines, and how they
are measured/scored. Reference data; slow-changing. See `sports-model.md`.

### 4. Organizations & Tenancy

**Owns:** `Tenant`, `Organization`, `Team`, organization membership.
**Responsibility:** the isolation boundary (Tenant) and the structured bodies
(clubs, schools, associations, LGUs, governing bodies, sponsors, venue
operators). Teams are competing units that belong to organizations. See
`organization-model.md`, `tenancy.md`, ADR-004.

### 5. Competition & Events

**Owns:** `EventContainer` (tournament/league/standalone), `CompetitionEvent`,
`EventFormat`, participant abstraction, brackets/draws (future).
**Responsibility:** defining and running competitions across all formats
(team, individual, timed, measured, judged, multi-participant). See
`competition-model.md`, ADR-005.

### 6. Registration & Eligibility

**Owns:** `Registration`, eligibility rules, check-in (future).
**Responsibility:** entering a participant into an event, verifying
eligibility, and separating the **participant** from the **payer**. See
`registration-model.md`, ADR-008.

### 7. Commerce / Payments

**Owns:** `Payment`, `PaymentLedgerEntry`, `Money`, refunds/settlements.
**Responsibility:** money movement, append-only financial audit, multi-currency.
Decoupled from registration domain logic via events. See `commerce-model.md`,
ADR-008.

### 8. Results & Achievements

**Owns:** `CompetitionResult`, `Achievement`, result immutability.
**Responsibility:** recording confirmed competition outcomes and deriving
verifiable achievements. Append-only; amendments never overwrite. See
`results-achievements-model.md`.

### 9. Rewards Ledger

**Owns:** `RewardsLedgerEntry`, derived `RewardsBalance`, verification/fraud
controls. **Responsibility:** Sports Points accounting. The ledger is the
source of truth; balances are projections. Marketplace/redemption is a future
consumer of this context. See `rewards-model.md`, ADR-006.

### 10. QR Credentials & Verification

**Owns:** `QrCredential`, `IdentityVerification`.
**Responsibility:** issuing, rotating, and revoking QR credentials, and tracking
identity verification levels. Permanent Sports ID QR is distinct from temporary
event credentials. See `qr-credentials-model.md`, ADR-007.

## Entity ownership summary

| Entity | Owning context |
|---|---|
| Person, SportsId | Identity & Sports ID |
| PersonRole, Permission | Person Roles & Authorization |
| Sport, Discipline | Sports Catalog |
| Tenant, Organization, Team | Organizations & Tenancy |
| EventContainer, CompetitionEvent | Competition & Events |
| Registration | Registration & Eligibility |
| Payment, PaymentLedgerEntry | Commerce / Payments |
| CompetitionResult, Achievement | Results & Achievements |
| RewardsLedgerEntry, RewardsBalance | Rewards Ledger |
| QrCredential, IdentityVerification | QR Credentials & Verification |

## Aggregate candidates

See `dependency-rules.md` for ownership detail and each model document for
aggregate boundaries. Summary:

- **Person** aggregate (Identity) — root: `Person`; includes `SportsId`.
- **PersonRole** aggregate (Roles) — root: `PersonRole`; scope-bound.
- **Organization** aggregate (Orgs) — root: `Organization`; includes memberships.
- **Team** aggregate (Orgs) — root: `Team`; references Organization.
- **EventContainer** aggregate (Competition) — root: `EventContainer`; includes `CompetitionEvent`s.
- **Registration** aggregate (Registration) — root: `Registration`.
- **Payment** aggregate (Commerce) — root: `Payment`; ledger entries appended.
- **CompetitionResult** aggregate (Results) — root: `CompetitionResult`; immutable.
- **Achievement** aggregate (Results) — root: `Achievement`; derived from verified results.
- **RewardsLedger** per-athlete (Rewards) — root: the athlete's ledger; append-only.
- **QrCredential** aggregate (Credentials) — root: `QrCredential`.

## Cross-context communication

Contexts never call each other's repositories directly. They communicate via:

1. **Domain events** published through the `EventBus` port. Consumers react
   asynchronously (e.g. `ResultConfirmed` → Rewards context considers issuance).
2. **Shared identifiers** from the shared kernel (`Id<"Person">`, `Id<"Event">`,
   etc.). Contexts reference each other only by typed IDs, never by importing
   another context's aggregate state.

This keeps contexts independently testable and replaceable.
