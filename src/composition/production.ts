import { SystemClock } from "@adapters/clock/system-clock";
import { UuidIdGenerator } from "@adapters/id/uuid-id-generator";
import { RandomSportsIdGenerator } from "@adapters/id/sports-id-generator";
import { InMemoryPersonRepository } from "@adapters/persistence/in-memory-person-repository";
import { NoopEventPublisher } from "@adapters/events/noop-event-publisher";
import type { DomainEvent, IntegrationEvent } from "@app/contracts/events";
import { CreatePerson } from "@app/use-cases/create-person";
import type { AppContainer } from "@composition/container";

/**
 * Production composition root. Wires real capability adapters to the
 * application contracts and constructs the available use cases.
 *
 * Event delivery uses a no-op publisher until a real broker adapter exists.
 * Person storage uses the in-memory repository, which is TEMPORARY and NOT
 * durable — it must be replaced by a persistent (Postgres/Supabase) adapter
 * before this container backs anything real. No database, authentication, or
 * UI is wired here.
 */
export function createProductionContainer(): AppContainer {
  const clock = new SystemClock();
  const idGenerator = new UuidIdGenerator();
  const sportsIdGenerator = new RandomSportsIdGenerator();
  // TEMPORARY: swap for a durable PersonRepository adapter before real use.
  const personRepository = new InMemoryPersonRepository();
  const domainEvents = new NoopEventPublisher<DomainEvent>();
  const integrationEvents = new NoopEventPublisher<IntegrationEvent>();

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
