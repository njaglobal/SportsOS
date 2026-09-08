import type { Id, ISODateString } from "@shared/kernel";

/**
 * Aggregate root marker. Concrete aggregates live under their bounded context.
 */
export interface AggregateRoot<B extends string> {
  readonly id: Id<B>;
}

/** Value object marker. Value objects are immutable and compared by value. */
export interface ValueObject {}

/**
 * Domain event marker. Events are produced by aggregates and represent
 * something that happened in the domain. The APPLICATION layer routes them
 * (via EventBus or other mechanisms) to interested contexts. The domain
 * itself does not depend on any port to publish events — it produces them,
 * and the application layer handles delivery.
 *
 * See ADR-017 for cross-context interaction rules.
 */
export interface DomainEvent {
  readonly eventId: string;
  readonly occurredAt: ISODateString;
  readonly aggregateId: string;
  readonly aggregateType: string;
}
