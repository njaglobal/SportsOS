import type { Id } from "@shared/kernel";

/**
 * Permanent Sports ID value object.
 *
 * Invariants (see docs/architecture/identity-model.md):
 *  - One Person has at most one Sports ID.
 *  - The Sports ID is permanent and survives account/entity deletion.
 *  - The Sports ID is issued by the platform, never chosen by the person.
 */
export interface SportsId {
  readonly value: Id<"SportsId">;
  readonly issuedAt: string;
  readonly status: SportsIdStatus;
}

export type SportsIdStatus = "active" | "revoked";

/**
 * Person — the legal/natural identity behind every platform role.
 * A Person is NOT a User (authentication subject), NOT an Athlete (sport role).
 * See docs/architecture/person-role-model.md.
 */
export interface Person {
  readonly id: Id<"Person">;
  readonly sportsId: SportsId | null;
  readonly displayName: string;
  readonly dateOfBirth: string | null;
  readonly guardianId: Id<"Person"> | null;
  readonly tenantId: Id<"Tenant">;
}
