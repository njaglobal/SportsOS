import type { Id } from "@shared/kernel";

/**
 * A Role is a capability bundle granted to a Person within a context boundary.
 * Authorization is permission-based, not role-name based (see ADR-004 and
 * docs/architecture/authorization.md).
 */
export type RoleKind =
  | "athlete"
  | "coach"
  | "organizer"
  | "official"
  | "team_manager"
  | "guardian";

export interface PersonRole {
  readonly personId: Id<"Person">;
  readonly role: RoleKind;
  readonly scope: RoleScope;
}

export type RoleScope =
  | { readonly kind: "global" }
  | { readonly kind: "organization"; readonly organizationId: Id<"Organization"> }
  | { readonly kind: "team"; readonly teamId: Id<"Team"> }
  | { readonly kind: "event"; readonly eventId: Id<"Event"> };
