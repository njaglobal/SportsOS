import type { Clock } from "@app/contracts/clock";
import type { IdGenerator } from "@app/contracts/id-generator";
import type {
  DomainEventPublisher,
  IntegrationEventPublisher,
} from "@app/contracts/events";

/**
 * The set of application capabilities wired at startup. This is the seam every
 * future use-case is constructed against. It contains capability contracts
 * only — no adapters, no infrastructure types — so both production and test
 * compositions satisfy the same shape.
 */
export interface AppContainer {
  readonly clock: Clock;
  readonly idGenerator: IdGenerator;
  readonly domainEvents: DomainEventPublisher;
  readonly integrationEvents: IntegrationEventPublisher;
}
