# ADR 003 — Multi-Sport Athlete Model

## Status

Accepted

## Date

2026-09-08

## Context

Athletes in SportsOS are multi-sport: a single athlete may participate in and
win across multiple sports throughout their lifetime (product vision; R3, R4).
A naive model would create one "Athlete" per sport (e.g. a BasketballAthlete
and a SwimmingAthlete for the same person), which would fragment identity,
duplicate achievements, and make a unified Sports Passport impossible.

## Decision

Model **one `Athlete` per Person**, sport-independent. Sport participation is
a separate **many-to-many** relationship (`AthleteSportParticipation`) linking
an Athlete to many Sports and Disciplines.

```typescript
interface Athlete {
  id: Id<"Athlete">;
  personId: Id<"Person">;
  tenantId: Id<"Tenant">;
  // no sport field — sport-independent
}

interface AthleteSportParticipation {
  athleteId: Id<"Athlete">;
  sportId: Id<"Sport">;
  disciplineId: Id<"Discipline"> | null;
  active: boolean;
}
```

The `Athlete` entity carries only `personId` and `tenantId`. All sport-specific
data lives on the participation link, not on the Athlete. Results, Achievements,
and the Rewards ledger reference the Athlete (not a sport-specific athlete
variant), so a person's record across sports is unified.

See `sports-model.md`, `identity-model.md`.

## Consequences

**Positive:**
- One unified sporting identity per person → a single Sports Passport.
- Achievements and rewards aggregate naturally across sports.
- Adding a new sport is a new participation record, not a new entity.
- Matches the product vision ("multi-sport athlete").

**Negative:**
- Queries for "athletes in sport X" go through the participation link, not a
  direct athlete-by-sport lookup. (Acceptable — indexable.)

## Alternatives considered

- **One Athlete per sport.** Rejected: fragments identity, duplicates the
  person across sports, blocks a unified passport.
- **Sport as a field on Athlete.** Rejected: forces one sport per athlete,
  contradicting the multi-sport requirement.
- **No Athlete entity; use Person + sport tags.** Rejected: the competition/
  results/rewards contexts need a stable, sport-independent sporting identity
  to reference; Person is too broad (includes non-athlete roles).

## Compliance

- `Athlete` type has no sport field.
- `AthleteSportParticipation` is the only sport linkage.
- Results/Achievements/Rewards reference `Id<"Athlete">`.
