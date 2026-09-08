import type { Id, ISODateString } from "@shared/kernel";

/**
 * Commerce / payment boundary (see ADR-008 and docs/architecture/commerce-model.md).
 *
 * Currency is NOT hard-coded. Amounts carry an ISO 4217 code.
 * Financial operations are auditable; the ledger is append-only.
 */
export type CurrencyCode = Brand<string, "Currency">;
import type { Brand } from "@shared/kernel";

export interface Money {
  readonly amountMinorUnits: number;
  readonly currency: CurrencyCode;
}

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded"
  | "partially_refunded"
  | "settled";

export interface Payment {
  readonly id: Id<"Payment">;
  readonly tenantId: Id<"Tenant">;
  readonly payerPersonId: Id<"Person">;
  readonly registrationId: Id<"Registration"> | null;
  readonly amount: Money;
  readonly status: PaymentStatus;
  readonly providerRef: string | null;
  readonly capturedAt: ISODateString | null;
}

/**
 * Append-only financial audit entry. Never mutated or deleted.
 */
export interface PaymentLedgerEntry {
  readonly id: Id<"PaymentLedgerEntry">;
  readonly paymentId: Id<"Payment">;
  readonly entryType: "charge" | "refund" | "settlement" | "adjustment";
  readonly amount: Money;
  readonly recordedAt: ISODateString;
}
