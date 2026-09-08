import type { Id, ISODateString } from "@shared/kernel";
import type { DomainEvent } from "@domain/aggregate";

/**
 * Ports = outbound interfaces the application layer needs. Adapters live in
 * src/adapters and are the ONLY place infrastructure (Supabase, browser APIs,
 * native bridges) is referenced. See docs/architecture/dependency-rules.md.
 */

export interface Repository<T, B extends string> {
  findById(id: Id<B>): Promise<T | null>;
  save(entity: T): Promise<void>;
}

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe(
    eventType: string,
    handler: (event: DomainEvent) => Promise<void>,
  ): void;
}

export interface Clock {
  now(): ISODateString;
}

export interface IdGenerator {
  next<B extends string>(brand: B): Id<B>;
}
