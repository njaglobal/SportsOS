import type { Id, ISODateString } from "@shared/kernel";
import type { DomainEvent } from "@domain/aggregate";

/**
 * Application-layer ports. These are owned by the APPLICATION layer, not the
 * domain layer. The domain layer contains business model and invariants only
 * and must NOT depend on these ports or on native/browser/infrastructure ports.
 *
 * Adapters in src/adapters implement these. This is the ONLY place
 * infrastructure (Supabase, browser APIs, native bridges) is referenced.
 *
 * See docs/architecture/dependency-rules.md, ADR-001, ADR-016.
 *
 * NOTE on cross-context interaction (ADR-017): bounded contexts do NOT
 * communicate solely through EventBus. They may also use synchronous
 * query/service ports and shared immutable identifiers. EventBus is one
 * option, chosen per consistency requirement.
 */

/**
 * Repository — owned by Application. Persists/retrieves domain entities.
 * The domain defines what needs persisting; the application owns the contract.
 */
export interface Repository<T, B extends string> {
  findById(id: Id<B>): Promise<T | null>;
  save(entity: T): Promise<void>;
}

/**
 * EventBus — owned by Application. Used for asynchronous cross-context
 * communication via domain/integration events. Not the ONLY cross-context
 * interaction mechanism; synchronous service ports are also permitted.
 */
export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe(
    eventType: string,
    handler: (event: DomainEvent) => Promise<void>,
  ): void;
}

/**
 * Clock — owned by Application. Provides the current time. The domain
 * receives timestamps as values, never calls a clock directly.
 */
export interface Clock {
  now(): ISODateString;
}

/**
 * IdGenerator — owned by Application. Generates unique identifiers. The
 * domain receives IDs as values, never calls a generator directly.
 */
export interface IdGenerator {
  next<B extends string>(brand: B): Id<B>;
}
