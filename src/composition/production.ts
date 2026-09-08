import { SystemClock } from "@adapters/clock/system-clock";
import { UuidIdGenerator } from "@adapters/id/uuid-id-generator";
import { InMemoryEventPublisher } from "@adapters/events/in-memory-event-publisher";
import type { DomainEvent, IntegrationEvent } from "@app/contracts/events";
import type { AppContainer } from "@composition/container";

/**
 * Production composition root. Wires real capability adapters to the
 * application contracts. It does NOT connect a database, initialize
 * authentication, or construct any product use-case — that arrives with
 * vertical slices. Event delivery uses an in-memory publisher for now; a real
 * broker adapter replaces it later without touching application code.
 */
export function createProductionContainer(): AppContainer {
  return {
    clock: new SystemClock(),
    idGenerator: new UuidIdGenerator(),
    domainEvents: new InMemoryEventPublisher<DomainEvent>(),
    integrationEvents: new InMemoryEventPublisher<IntegrationEvent>(),
  };
}
