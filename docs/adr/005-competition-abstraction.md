# ADR 005 — Competition Abstraction

## Status

Accepted

## Date

2026-09-08

## Context

SportsOS must support tournaments, leagues, and standalone events; team and
individual competitions; timed, measured, scored, judged, and multi-participant
formats (R11). The competition model must be extensible to new formats without
schema changes or code branches in other contexts.

## Decision

1. **EventContainer** is a container (kind: `tournament` | `league` |
   `standalone`) that holds one or more **CompetitionEvent**s.
2. **CompetitionEvent** carries:
   - `format` (extensible enum: single_elimination, double_elimination,
     round_robin, swiss, timed_finals, measured_final, judged,
     group_then_knockout, …).
   - `participantKind` (`individual` | `team`).
   - `measure` (from the Discipline: timed, measured_distance, measured_score,
     judged, head_to_head, placement).
3. The **participant abstraction** is a discriminated union: `participantId`
   is `Id<"Athlete">` or `Id<"Team">` depending on `participantKind`.
4. **Format is data, not a code branch in other contexts.** Results and
   Registration treat format opaquely; only the Competition context
   interprets format for bracket/draw structure (future aggregate).
5. **Scoring/results belong to a separate context** (Results & Achievements),
   not Competition. Competition owns structure; Results owns outcomes.

See `competition-model.md`, `results-achievements-model.md`.

## Consequences

**Positive:**
- One model handles team, individual, timed, measured, judged, and
  multi-participant events.
- New formats are non-breaking additions.
- A tournament can contain both individual and team events.
- Results immutability is independent of bracket mutations.

**Negative:**
- The bracket/draw structure per format is a future aggregate (not modeled
  this sprint) — but the seam is clean.
- Participant type discrimination must be enforced where `participantId` is
  consumed.

## Alternatives considered

- **Separate models per format.** Rejected: explodes the schema and forces
  every consumer (registration, results) to special-case formats.
- **Competition owns results.** Rejected: coupling structure and outcomes
  would make results mutable alongside bracket changes, violating R5.
- **Team and individual as separate hierarchies.** Rejected: the participant
  abstraction unifies them cleanly.

## Compliance

- `CompetitionEvent.format`, `.participantKind`, `.measure` are required.
- Results context records outcomes without branching on format.
- New formats are added to the `EventFormat` union without other changes.
