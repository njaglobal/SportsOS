import type { Id } from "@shared/kernel";

/**
 * Permanent Sports ID value object.
 *
 * Invariants (see docs/architecture/identity-model.md, ADR-002):
 *  - One Person has at most one Sports ID.
 *  - The Sports ID is permanent and survives account/entity deletion.
 *  - The Sports ID is issued by the platform, never chosen by the person.
 *  - The Sports ID is platform-global identity, NOT tenant/organization-owned.
 *  - SportsId and QrCredential are separate concepts (ADR-007).
 */
export interface SportsId {
  readonly value: Id<"SportsId">;
  readonly issuedAt: string;
  readonly status: SportsIdStatus;
}

export type SportsIdStatus = "active" | "revoked";

/**
 * Person — the natural/legal identity behind every platform role.
 * A Person is NOT a User (authentication subject), NOT an AthleteProfile.
 *
 * Ownership: platform-global identity. A Person does NOT belong to the first
 * organization/event in which they participate. Person has no tenantId.
 *
 * See docs/architecture/identity-model.md, ADR-002, ADR-010.
 */
export interface Person {
  readonly id: Id<"Person">;
  readonly sportsId: SportsId | null;
  readonly displayName: string;
  readonly dateOfBirth: string | null;
  readonly guardianId: Id<"Person"> | null;
  readonly lifecycleStatus: PersonLifecycleStatus;
}

/**
 * Person lifecycle is distinct from account closure and from identity archival.
 * See docs/architecture/audit-integrity.md, ADR-011.
 */
export type PersonLifecycleStatus =
  | "active"
  | "deactivated"
  | "archived"
  | "anonymized";
