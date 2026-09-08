import { SystemClock } from "@adapters/clock/system-clock";
import { UuidIdGenerator } from "@adapters/id/uuid-id-generator";
import { RandomSportsIdGenerator } from "@adapters/id/sports-id-generator";
import { InMemoryPersonRepository } from "@adapters/persistence/in-memory-person-repository";
import { InMemoryAthleteProfileRepository } from "@adapters/persistence/in-memory-athlete-profile-repository";
import { InMemorySportDirectory } from "@adapters/sports/in-memory-sport-directory";
import { NoopEventPublisher } from "@adapters/events/noop-event-publisher";
import type { DomainEvent, IntegrationEvent } from "@app/contracts/events";
import { CreatePerson } from "@app/use-cases/create-person";
import { CreateAthleteProfile } from "@app/use-cases/create-athlete-profile";
import { AddAthleteSport } from "@app/use-cases/add-athlete-sport";
import type { AppContainer } from "@composition/container";

/**
 * Production composition root. Wires real capability adapters to the
 * application contracts and constructs the available use cases.
 *
 * Event delivery uses a no-op publisher until a real broker adapter exists.
 * Person and athlete storage use in-memory repositories, and the sport lookup
 * uses an in-memory directory: these are TEMPORARY and NOT durable. They must be
 * replaced by persistent adapters (and the SportDirectory backed by the real
 * Sports Catalog) before this container backs anything real. No database,
 * authentication, or UI is wired here.
 */
export function createProductionContainer(): AppContainer {
  const clock = new SystemClock();
  const idGenerator = new UuidIdGenerator();
  const sportsIdGenerator = new RandomSportsIdGenerator();
  // TEMPORARY: swap for durable adapters before real use.
  const personRepository = new InMemoryPersonRepository();
  const athleteProfileRepository = new InMemoryAthleteProfileRepository();
  // TEMPORARY: stands in for the future Sports Catalog query port; seeds nothing.
  const sportDirectory = new InMemorySportDirectory();
  const domainEvents = new NoopEventPublisher<DomainEvent>();
  const integrationEvents = new NoopEventPublisher<IntegrationEvent>();

  return {
    clock,
    idGenerator,
    sportsIdGenerator,
    personRepository,
    athleteProfileRepository,
    sportDirectory,
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
      createAthleteProfile: new CreateAthleteProfile({
        clock,
        idGenerator,
        personRepository,
        athleteProfileRepository,
        domainEvents,
      }),
      addAthleteSport: new AddAthleteSport({
        clock,
        idGenerator,
        athleteProfileRepository,
        sportDirectory,
        domainEvents,
      }),
    },
  };
}
