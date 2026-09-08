import type { Id, ISODateString } from "@shared/kernel";

/**
 * Rewards accounting boundary (see ADR-006 and docs/architecture/rewards-model.md).
 *
 * Source of truth is an append-only ledger. A balance is a DERIVED projection
 * of the ledger, never authoritative. Reward issuance supports fraud controls
 * and event verification (invariant 17).
 */
export type LedgerEntryKind = "issuance" | "redemption" | "adjustment" | "expiry";

export interface RewardsLedgerEntry {
  readonly id: Id<"RewardsLedgerEntry">;
  readonly tenantId: Id<"Tenant">;
  readonly athleteId: Id<"Athlete">;
  readonly kind: LedgerEntryKind;
  readonly points: number;
  readonly sourceResultId: Id<"Result"> | null;
  readonly verified: boolean;
  readonly verificationRef: string | null;
  readonly recordedAt: ISODateString;
}

/**
 * Derived balance — recomputed from the ledger, not authoritative.
 */
export interface RewardsBalance {
  readonly athleteId: Id<"Athlete">;
  readonly tenantId: Id<"Tenant">;
  readonly available: number;
  readonly pending: number;
  readonly asOfLedgerEntryId: string;
}
