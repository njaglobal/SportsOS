# Person-Role Model

> One Person, many roles. See ADR-002, `authorization.md`, and R1.

## Model

A `PersonRole` binds a `Person` to a `RoleKind` within a `RoleScope`. A Person
may hold many `PersonRole` entries simultaneously.

```typescript
type RoleKind =
  | "athlete" | "coach" | "organizer"
  | "official" | "team_manager" | "guardian";

interface PersonRole {
  personId: Id<"Person">;
  role: RoleKind;
  scope: RoleScope;
}

type RoleScope =
  | { kind: "global" }
  | { kind: "organization"; organizationId: Id<"Organization"> }
  | { kind: "team"; teamId: Id<"Team"> }
  | { kind: "event"; eventId: Id<"Event"> };
```

## Scope semantics

- **global** — the role applies platform-wide (e.g. a global official).
- **organization** — the role applies within one organization (e.g. a coach
  of Club X).
- **team** — the role applies to one team (e.g. team manager of Team Y).
- **event** — the role applies to one event (e.g. an official for Event Z).

A Person may be a coach in Organization A and an athlete in Team B at the same
time. Roles are additive, not exclusive.

## Athlete role vs Athlete entity

There is a deliberate distinction:

- **Athlete role** (`PersonRole.role === "athlete"`) — grants athlete
  **permissions** in a scope (e.g. register for events, view own results).
- **Athlete entity** (`Athlete`) — the **competition-domain projection** of a
  Person, referenced by results, achievements, and the rewards ledger.

A Person gains the athlete **role** to be permitted to compete; the
`Athlete` entity is the enduring record of their sporting identity. The two
are linked via `personId`.

```mermaid
flowchart LR
  Person -- "personId" --> Athlete
  Person -- "personId + role + scope" --> PersonRole
  PersonRole -- "role === athlete" -.permits.-> Athlete
```

## Guardian role

The `guardian` role is scoped to a Person (the minor). It is held by the
guardian Person and grants permission to act on behalf of the minor
(registrations, payments, credential management). The guardian relationship
is also recorded directly on the minor's `Person.guardianId` for identity
purposes (see `identity-model.md`).

## Multi-role invariants

1. Roles are **append/grant and revoke** — never hard-coded checks on names.
2. A role grant is always **scoped**; there is no un-scoped role.
3. Role evaluation is **permission-based** (R15). Code checks `can(person,
   permission, scope)`, never `person.role === "organizer"`. See
   `authorization.md`.
4. Granting/revoking roles is **auditable** (R16-style audit trail).

## Permissions (summary)

Permissions are defined per context (e.g. `competition.event.create`,
`registration.submit`, `rewards.issuance.verify`). The authorization context
resolves whether a Person's roles grant a given permission in a given scope.
Full permission catalog is defined in `authorization.md`.
