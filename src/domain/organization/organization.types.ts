import type { Id } from "@shared/kernel";

/**
 * Organization — any structured body that owns or governs sport activity:
 * clubs, schools, associations, LGUs, governing bodies, sponsors (as
 * commercial orgs), venue operators. Discriminated by `kind`.
 *
 * Multi-tenancy is organization-scoped (see docs/architecture/tenancy.md).
 * A Tenant is the isolation boundary; an Organization is a member of a Tenant.
 */
export type OrganizationKind =
  | "club"
  | "school"
  | "association"
  | "lgu"
  | "governing_body"
  | "sponsor"
  | "venue_operator";

export interface Organization {
  readonly id: Id<"Organization">;
  readonly tenantId: Id<"Tenant">;
  readonly kind: OrganizationKind;
  readonly legalName: string;
  readonly parentId: Id<"Organization"> | null;
}

/**
 * Team — a competing unit within competitions. A Team belongs to an
 * Organization but is NOT the organization itself (see ADR-005 and
 * docs/architecture/organization-model.md).
 */
export interface Team {
  readonly id: Id<"Team">;
  readonly tenantId: Id<"Tenant">;
  readonly organizationId: Id<"Organization">;
  readonly name: string;
  readonly sportId: Id<"Sport">;
}
