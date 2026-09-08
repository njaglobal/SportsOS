import { FakeClock } from "@adapters/clock/fake-clock";
import { FakeIdGenerator } from "@adapters/id/fake-id-generator";
import { InMemoryEventPublisher } from "@adapters/events/in-memory-event-publisher";
import type { DomainEvent, IntegrationEvent } from "@app/contracts/events";
import type { AppContainer } from "@composition/container";

/**
 * Test composition root. Wires deterministic capability adapters so future
 * use-case tests are reproducible. Exposes the concrete deterministic types
 * (FakeClock, FakeIdGenerator, InMemoryEventPublisher) so a test can advance
 * the clock or assert on recorded events, while still satisfying AppContainer.
 */
export interface TestContainer extends AppContainer {
  readonly clock: FakeClock;
  readonly idGenerator: FakeIdGenerator;
  readonly domainEvents: InMemoryEventPublisher<DomainEvent>;
  readonly integrationEvents: InMemoryEventPublisher<IntegrationEvent>;
}

export function createTestContainer(): TestContainer {
  return {
    clock: new FakeClock(),
    idGenerator: new FakeIdGenerator(),
    domainEvents: new InMemoryEventPublisher<DomainEvent>(),
    integrationEvents: new InMemoryEventPublisher<IntegrationEvent>(),
  };
}
