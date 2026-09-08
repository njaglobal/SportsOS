# Architecture Version

> Versioning of the SportsOS architecture documentation.

## Current version

**SportsOS Architecture v0.4.0 — Sprint 2 (First Vertical Slice: Create Person + Sports ID)**

- Date: 2026-09-09
- Sprint: 2 (Create Person + issue permanent Sports ID)
- Status: Active
- Supersedes: v0.3.0 (Sprint 1)

## What changed in v0.4.0 (Sprint 2)

A **MINOR** bump: the first business capability plus two enforcement
corrections, no breaking change to the layer model.

1. **Preliminary correction A — ports re-homed.** The `src/ports/` layer was
   removed; native platform capability contracts moved to
   `src/app/contracts/platform/`. The `@ports` alias and `domain-no-ports` rule
   were retired (ADR-016).
2. **Preliminary correction B — cross-context tightened.** The `no-cross-context`
   rule now forbids **type-only** imports across bounded contexts too. The shared
   `CompetitionMeasure` vocabulary moved to `@shared/measurement`; Sports and
   Competition both import it from there (ADR-018).
3. **Create Person slice.** `createPerson` domain factory + `SportsId` value
   object; `PersonCreated` and `SportsIdIssued` domain events; `CreatePerson`
   use case with typed failures; `SportsIdGenerator` and context-specific
   `PersonRepository` contracts; `RandomSportsIdGenerator`/`FakeSportsIdGenerator`
   and `InMemoryPersonRepository` adapters (ADR-002).
4. **Composition** now wires the `CreatePerson` use case in both production and
   test containers; production marks in-memory storage as temporary.
5. **Tests** cover the domain factory, the use case (success, determinism,
   collision retry + bounded-error, no events on failure), and the repository.

## What changed in v0.3.0 (Sprint 1)

A **MINOR** bump: additive structure and tooling, no breaking change to the
layer model.

1. **Machine-enforced boundaries** — `dependency-cruiser` (`.dependency-cruiser.cjs`)
   now enforces every layer and context-isolation rule; run with
   `npm run architecture:check` (ADR-018, now implemented).
2. **Application foundation** — `src/app/contracts/` adds `UseCase`,
   `AppResult`/`AppError`, `Clock`, `IdGenerator`, and event contracts. The
   generic `Repository` and `EventBus` interfaces were removed.
3. **DomainEvent vs IntegrationEvent** — explicitly distinguished; the domain
   keeps `DomainEvent`, the application owns `IntegrationEvent` and
   `EventPublisher`.
4. **Deterministic platform impls** — `SystemClock`/`FakeClock`,
   `UuidIdGenerator`/`FakeIdGenerator`, `InMemoryEventPublisher`/`NoopEventPublisher`
   under `src/adapters/`.
5. **Composition root** — `src/composition/` wires production and test
   containers without connecting a database or auth.
6. **Deterministic test infrastructure** — `vitest`; tests under `tests/` prove
   the clock, ID generator, event publisher, and architecture checker behavior.
7. **Clarifications** recorded as rules R27–R30: TeamMembership is
   team/organization-scoped (event participation is a future EventRosterEntry);
   `tenantId` is an isolation boundary; aggregate-root status is decided by
   invariants/lifecycle; repositories are context-specific, not generic CRUD.

## What changed in v0.2.0 (Sprint 0.1 corrections)

This is a **MINOR** version bump (additive corrections to boundaries and
classifications, no breaking change to the layer model). 11 corrections:

1. **Ownership & tenancy** — removed "every entity is tenant-owned"; added 6
   ownership classifications; Person/SportsId are platform-global.
2. **Person vs Athlete** — AthleteProfile is optional (renamed from Athlete);
   a Person does not automatically become an athlete.
3. **Retention & deletion** — replaced blanket "soft delete only" with a
   layered retention model (account closure, deactivation, archival,
   anonymization, historical preservation, audit retention).
4. **Competition aggregates** — replaced unbounded EventContainer+CompetitionEvent
   with independent aggregate lifecycles (Event → Competition → Division →
   Stage → Contest).
5. **Commerce** — replaced single Payment+ledger with separated concepts
   (RegistrationCharge, Order, PaymentAttempt, PaymentTransaction, Refund,
   Settlement, OrganizerPayout).
6. **Rewards** — added idempotent issuance, source identity, earning rule
   identity/version, duplicate-award prevention, reversal entries.
7. **QR credential lifecycle** — added full lifecycle states (issued, active,
   expired, revoked, replaced, compromised); SportsId and QrCredential are
   separate.
8. **Authorization** — replaced flat PersonRole with memberships/assignments
   (OrganizationMembership, OrganizationRoleAssignment, TeamMembership,
   EventAssignment, PlatformRoleAssignment, GuardianRelationship).
9. **Cross-context interaction** — removed "EventBus only" rule; added
   synchronous query/service ports and published application contracts as
   valid interaction mechanisms.
10. **Layer/port ownership** — Domain no longer depends on ports; Application
    owns ports; native ports are application-owned, outside Domain.
11. **Architecture enforcement** — documented machine-enforced boundaries
    planned for Sprint 1 (ADR-018).

## Versioning scheme

Semantic versioning, applied to the **architecture** (not the product):

- **MAJOR** — a breaking change to the layer model, dependency rules, or a
  bounded context boundary (requires new/superseding ADRs).
- **MINOR** — additive change (new context, new port, new aggregate, corrected
  classifications) that does not break existing boundaries.
- **PATCH** — clarification, typo, or non-structural correction.

## Change process

1. Any architectural change that affects boundaries, dependencies, or
   invariants requires an ADR (new or superseding).
2. Update this version file with the new version and date.
3. Update affected architecture documents.
4. Re-run quality gates (build, typecheck, lint).

## ADR index

| ADR | Title | Sprint 0.1 status |
|---|---|---|
| [000](../adr/000-template.md) | ADR Template | — |
| [001](../adr/001-modular-domain-architecture.md) | Modular Domain Architecture | Clarified [C] |
| [002](../adr/002-person-and-sports-id.md) | Person and Sports ID | Clarified [C] |
| [003](../adr/003-multi-sport-athlete-model.md) | Multi-Sport Athlete Model | Clarified [C] |
| [004](../adr/004-organization-tenancy.md) | Organization and Tenancy | Clarified [C] |
| [005](../adr/005-competition-abstraction.md) | Competition Abstraction | Clarified [C] |
| [006](../adr/006-rewards-ledger.md) | Rewards Ledger | Clarified [C] |
| [007](../adr/007-qr-credential-security.md) | QR Credential Security | Clarified [C] |
| [008](../adr/008-commerce-boundary.md) | Commerce Boundary | Clarified [C] |
| [009](../adr/009-web-first-mobile-distribution.md) | Web-First, Mobile Distribution | — |
| [010](../adr/010-ownership-classification.md) | Ownership Classification | **New** [C] |
| [011](../adr/011-retention-and-privacy.md) | Retention and Privacy Architecture | **New** [C] |
| [012](../adr/012-membership-authorization.md) | Membership-Based Authorization | **New** [C] |
| [013](../adr/013-competition-aggregate-lifecycles.md) | Competition Aggregate Lifecycles | **New** [C] |
| [014](../adr/014-commerce-concept-separation.md) | Commerce Concept Separation | **New** [C] |
| [015](../adr/015-rewards-idempotency.md) | Rewards Idempotency and Reversal | **New** [C] |
| [016](../adr/016-layer-port-ownership.md) | Layer and Port Ownership | **New** [C] |
| [017](../adr/017-cross-context-interaction.md) | Cross-Context Interaction | **New** [C] |
| [018](../adr/018-architecture-enforcement.md) | Architecture Enforcement | Implemented [S1], extended [S2] |

## Sprint 0.1 deliverable map

All Sprint 0 deliverables retained. Updated documents are marked [C]:

| Deliverable | Location |
|---|---|
| Architecture overview [C] | `architecture-overview.md` |
| Architecture rules [C] | `architecture-rules.md` |
| Bounded contexts [C] | `bounded-contexts.md` |
| Dependency rules [C][S1] | `dependency-rules.md` |
| Identity model [C] | `identity-model.md` |
| Person-role model [C] | `person-role-model.md` |
| Organization model [C] | `organization-model.md` |
| Sports model | `sports-model.md` |
| Competition model [C] | `competition-model.md` |
| Registration model | `registration-model.md` |
| Commerce model [C] | `commerce-model.md` |
| Results & achievements | `results-achievements-model.md` |
| Rewards model [C] | `rewards-model.md` |
| QR credentials model [C] | `qr-credentials-model.md` |
| Tenancy [C] | `tenancy.md` |
| Authorization [C] | `authorization.md` |
| Geography & localization | `geography-localization.md` |
| Audit & integrity [C] | `audit-integrity.md` |
| Client platforms | `client-platforms.md` |
| Mobile strategy | `mobile-strategy.md` |
| Offline resilience | `offline-resilience.md` |
| Application foundation [S1] | `application-foundation.md` |
| Version [C][S1] | `architecture-version.md` |
| ADRs (10 updated + 9 new) [C] | `docs/adr/` |
| Source boundaries [C][S1] | `src/` (app/, adapters/, composition/, tests/) |
