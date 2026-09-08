/**
 * Aggregate root marker. Concrete aggregates live under their bounded context.
 */
export interface AggregateRoot<B extends string> {
  readonly id: Id<B>;
}

/** Value object marker. Value objects are immutable and compared by value. */
export interface ValueObject {}

/**
 * Domain event marker. Events are published by aggregates, routed through an
 * application-layer port (EventBus), and consumed by other contexts without
 * direct coupling.
 */
export interface DomainEvent {
  readonly eventId: string;
  readonly occurredAt: ISODateString;
  readonly aggregateId: string;
  readonly aggregateType: string;
}

import type { Id, ISODateString } from "@shared/kernel";
