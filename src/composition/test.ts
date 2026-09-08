import { FakeClock } from "@adapters/clock/fake-clock";
import { FakeIdGenerator } from "@adapters/id/fake-id-generator";
import { FakeSportsIdGenerator } from "@adapters/id/fake-sports-id-generator";
import { InMemoryPersonRepository } from "@adapters/persistence/in-memory-person-repository";
import { InMemoryEventPublisher } from "@adapters/events/in-memory-event-publisher";
import type { DomainEvent, IntegrationEvent } from "@app/contracts/events";
import { CreatePerson } from "@app/use-cases/create-person";
import type { AppContainer } from "@composition/container";

/**
 * Test composition root. Wires deterministic capability adapters so use-case
 * tests are reproducible. Exposes the concrete deterministic types so a test
 * can advance the clock, force a Sports ID collision, inspect the repository,
 * or assert on recorded events, while still satisfying AppContainer.
 */
export interface TestContainer extends AppContainer {
  readonly clock: FakeClock;
  readonly idGenerator: FakeIdGenerator;
  readonly sportsIdGenerator: FakeSportsIdGenerator;
  readonly personRepository: InMemoryPersonRepository;
  readonly domainEvents: InMemoryEventPublisher<DomainEvent>;
  readonly integrationEvents: InMemoryEventPublisher<IntegrationEvent>;
}

export function createTestContainer(): TestContainer {
  const clock = new FakeClock();
  const idGenerator = new FakeIdGenerator();
  const sportsIdGenerator = new FakeSportsIdGenerator();
  const personRepository = new InMemoryPersonRepository();
  const domainEvents = new InMemoryEventPublisher<DomainEvent>();
  const integrationEvents = new InMemoryEventPublisher<IntegrationEvent>();

  return {
    clock,
    idGenerator,
    sportsIdGenerator,
    personRepository,
    domainEvents,
    integrationEvents,
    useCases: {
      createPerson: new CreatePerson({
        clock,
        idGenerator,
        sportsIdGenerator,
        personRepository,
        domainEvents,
      }),
    },
  };
}
