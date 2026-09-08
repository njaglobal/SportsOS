import type { Id } from "@shared/kernel";
import type { CompetitionMeasure } from "@domain/sports/sports.types";

/**
 * Competition Event — a single unit of competition with a format.
 * Tournament / League are containers of events (see ADR-005).
 */
export type EventFormat =
  | "single_elimination"
  | "double_elimination"
  | "round_robin"
  | "swiss"
  | "timed_finals"
  | "measured_final"
  | "judged"
  | "group_then_knockout";

export type ParticipantKind = "individual" | "team";

export interface CompetitionEvent {
  readonly id: Id<"Event">;
  readonly tenantId: Id<"Tenant">;
  readonly containerId: Id<"EventContainer">;
  readonly sportId: Id<"Sport">;
  readonly disciplineId: Id<"Discipline"> | null;
  readonly format: EventFormat;
  readonly participantKind: ParticipantKind;
  readonly measure: CompetitionMeasure;
}

export type EventContainerKind = "tournament" | "league" | "standalone";

export interface EventContainer {
  readonly id: Id<"EventContainer">;
  readonly tenantId: Id<"Tenant">;
  readonly kind: EventContainerKind;
  readonly name: string;
  readonly organizerOrganizationId: Id<"Organization">;
}
