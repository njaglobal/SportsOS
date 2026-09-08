import type { Id } from "@shared/kernel";

/**
 * Sport — a top-level sport (e.g. Basketball, Swimming, Track & Field).
 * Discipline — a specialised branch within a sport (e.g. 100m within Track).
 * Athlete↔Sport is many-to-many; athlete identity is sport-independent.
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
  readonly athleteId: Id<"Athlete">;
  readonly sportId: Id<"Sport">;
  readonly disciplineId: Id<"Discipline"> | null;
  readonly active: boolean;
}

/**
 * Athlete — a role projection of a Person. One Person may be one Athlete
 * across all sports (the Athlete is sport-independent). See ADR-003.
 */
export interface Athlete {
  readonly id: Id<"Athlete">;
  readonly personId: Id<"Person">;
  readonly tenantId: Id<"Tenant">;
}
