import type { Id, ISODateString } from "@shared/kernel";

/**
 * QR credential trust model (see ADR-007 and docs/architecture/qr-credentials-model.md).
 *
 * Permanent Sports ID QR and temporary/dynamic event credentials are SEPARATE
 * (invariant 9). A QR identifies a person but must NOT carry sensitive data
 * (invariant 8). QR identity, biometric/device auth, and identity verification
 * are separate concepts (invariant 10).
 */
export type QrCredentialKind = "permanent_sports_id" | "event_credential";

export interface QrCredential {
  readonly id: Id<"QrCredential">;
  readonly tenantId: Id<"Tenant">;
  readonly personId: Id<"Person">;
  readonly kind: QrCredentialKind;
  readonly payloadToken: string;
  readonly expiresAt: ISODateString | null;
  readonly rotatedAt: ISODateString | null;
  readonly revoked: boolean;
}

export type IdentityVerificationLevel = "none" | "self" | "document" | "verified";

export interface IdentityVerification {
  readonly id: Id<"IdentityVerification">;
  readonly personId: Id<"Person">;
  readonly level: IdentityVerificationLevel;
  readonly verifiedAt: ISODateString | null;
}
