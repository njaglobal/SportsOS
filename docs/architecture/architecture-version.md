# Architecture Version

> Versioning of the SportsOS architecture documentation.

## Current version

**SportsOS Architecture v0.1.0 — Sprint 0 (Architecture Only)**

- Date: 2026-09-08
- Sprint: 0 (Architecture)
- Status: Approved for Sprint 1 planning

## Versioning scheme

Semantic versioning, applied to the **architecture** (not the product):

- **MAJOR** — a breaking change to the layer model, dependency rules, or a
  bounded context boundary (requires new/superseding ADRs).
- **MINOR** — additive change (new context, new port, new aggregate) that does
  not break existing boundaries.
- **PATCH** — clarification, typo, or non-structural correction.

## Change process

1. Any architectural change that affects boundaries, dependencies, or
   invariants requires an ADR (new or superseding).
2. Update this version file with the new version and date.
3. Update affected architecture documents.
4. Re-run quality gates (build, typecheck, lint).

## ADR index

| ADR | Title |
|---|---|
| [000](../adr/000-template.md) | ADR Template |
| [001](../adr/001-modular-domain-architecture.md) | Modular Domain Architecture |
| [002](../adr/002-person-and-sports-id.md) | Person and Sports ID |
| [003](../adr/003-multi-sport-athlete-model.md) | Multi-Sport Athlete Model |
| [004](../adr/004-organization-tenancy.md) | Organization and Tenancy |
| [005](../adr/005-competition-abstraction.md) | Competition Abstraction |
| [006](../adr/006-rewards-ledger.md) | Rewards Ledger |
| [007](../adr/007-qr-credential-security.md) | QR Credential Security |
| [008](../adr/008-commerce-boundary.md) | Commerce Boundary |
| [009](../adr/009-web-first-mobile-distribution.md) | Web-First, Mobile Distribution |

## Sprint 0 deliverable map

| Deliverable | Location |
|---|---|
| Architecture overview | `architecture-overview.md` |
| Architecture rules | `architecture-rules.md` |
| Bounded contexts | `bounded-contexts.md` |
| Dependency rules | `dependency-rules.md` |
| Identity model | `identity-model.md` |
| Person-role model | `person-role-model.md` |
| Organization model | `organization-model.md` |
| Sports model | `sports-model.md` |
| Competition model | `competition-model.md` |
| Registration model | `registration-model.md` |
| Commerce model | `commerce-model.md` |
| Results & achievements | `results-achievements-model.md` |
| Rewards model | `rewards-model.md` |
| QR credentials model | `qr-credentials-model.md` |
| Tenancy | `tenancy.md` |
| Authorization | `authorization.md` |
| Geography & localization | `geography-localization.md` |
| Audit & integrity | `audit-integrity.md` |
| Client platforms | `client-platforms.md` |
| Mobile strategy | `mobile-strategy.md` |
| Offline resilience | `offline-resilience.md` |
| Version | `architecture-version.md` |
| ADRs | `docs/adr/` |
| Source boundaries | `src/` |

## What changed the architecture version

This is the initial version. All future changes must bump this version and
record the rationale in an ADR.
