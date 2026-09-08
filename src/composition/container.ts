import type { Clock } from "@app/contracts/clock";
import type { IdGenerator } from "@app/contracts/id-generator";
import type { SportsIdGenerator } from "@app/contracts/sports-id-generator";
import type { PersonRepository } from "@app/contracts/person-repository";
import type {
  DomainEventPublisher,
  IntegrationEventPublisher,
} from "@app/contracts/events";
import type { CreatePerson } from "@app/use-cases/create-person";

/**
 * The set of application capabilities and use cases wired at startup. This is
 * the seam every use case is constructed against. It contains capability
 * contracts and use-case instances only — no adapter or infrastructure types —
 * so both production and test compositions satisfy the same shape.
 */
export interface AppContainer {
  readonly clock: Clock;
  readonly idGenerator: IdGenerator;
  readonly sportsIdGenerator: SportsIdGenerator;
  readonly personRepository: PersonRepository;
  readonly domainEvents: DomainEventPublisher;
  readonly integrationEvents: IntegrationEventPublisher;
  readonly useCases: AppUseCases;
}

export interface AppUseCases {
  readonly createPerson: CreatePerson;
}
