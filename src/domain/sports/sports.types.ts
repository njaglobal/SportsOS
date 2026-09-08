import type { Id } from "@shared/kernel";

/**
 * Sport — a top-level sport (e.g. Basketball, Swimming, Track & Field).
 * Discipline — a specialised branch within a sport (e.g. 100m within Track).
 *
 * Ownership: platform-global reference data (ADR-010). Not tenant-scoped.
 * A future controlled customization model may allow tenant-specific extensions.
 * AthleteProfile↔Sport is many-to-many; athlete identity is sport-independent.
 */
export interface Sport {
  readonly id: Id<"Sport">;
  readonly code: string;
  readonly name: string;
}

export interface Discipline {
  readonly id: Id<"Discipline">;
  readonly sportId: Id<"Sport">;
  readonly code: string;
  readonly name: string;
  readonly measure: CompetitionMeasure;
}

export type CompetitionMeasure =
  | "timed"
  | "measured_distance"
  | "measured_score"
  | "judged"
  | "head_to_head"
  | "placement";

export interface AthleteSportParticipation {
  readonly athleteProfileId: Id<"AthleteProfile">;
  readonly sportId: Id<"Sport">;
  readonly disciplineId: Id<"Discipline"> | null;
  readonly active: boolean;
}

/**
 * AthleteProfile — a sport-independent sporting identity projection of a
 * Person. A Person MAY have at most one AthleteProfile. A Person does NOT
 * automatically become an athlete; they may exist only as a coach, guardian,
 * official, organizer, staff member, sponsor representative, etc.
 *
 * Ownership: person-owned (created by/for a Person, not by an organization).
 * See ADR-003, ADR-010, docs/architecture/identity-model.md.
 */
export interface AthleteProfile {
  readonly id: Id<"AthleteProfile">;
  readonly personId: Id<"Person">;
}
