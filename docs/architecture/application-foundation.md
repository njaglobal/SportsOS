# Application Foundation

> Sprint 1 introduced the minimal application-layer foundation and deterministic
> platform implementations that future vertical slices are built on. No product
> behavior is implemented. See ADR-016, ADR-018, and `dependency-rules.md`.

## Application contracts (`src/app/contracts/`)

| Contract | Purpose |
|---|---|
| `UseCase<Input, Output>` | Every operation is a use-case returning `Promise<AppResult<Output>>`. |
| `AppError` / `AppResult<T>` | Application error shape (reuses the shared `Result` carrier and error shape). |
| `Clock` | Supplies the current time as an `ISODateString`; the domain never reads the wall clock. |
| `IdGenerator` | Supplies branded identifiers; the domain never generates IDs. |
| `EventPublisher<E>` | Emits events; specialized as `DomainEventPublisher` and `IntegrationEventPublisher`. |

There is deliberately **no generic `Repository<T>`**. Persistence contracts are
defined per bounded context / use-case when a slice needs them, so an aggregate
keeps the exact query and mutation surface it requires instead of a forced,
uniform CRUD interface (clarification 4).

## DomainEvent vs IntegrationEvent

Two distinct concepts, deliberately separated:

- **`DomainEvent`** (`src/domain/aggregate.ts`) — a completed fact **inside a
  single bounded context**, expressed in that context's language. It is not a
  transport concern and may evolve freely as the context evolves.
- **`IntegrationEvent`** (`src/app/contracts/events.ts`) — a versioned,
  self-describing message intended for delivery **outside** the originating
  context. It carries `eventType`, `source`, `version`, and an opaque
  `payload`.

The application layer translates selected domain events into integration
events. External consumers depend only on the integration contract, so internal
domain events can change without breaking them. No production message broker is
built this sprint; an `EventPublisher` with an in-memory implementation is
sufficient for wiring and future use-case tests.

## Deterministic and production implementations (`src/adapters/`)

These live outside the domain and implement application contracts:

| Contract | Production | Deterministic (tests) |
|---|---|---|
| `Clock` | `SystemClock` (wall clock) | `FakeClock` (fixed start, `advance`/`set`) |
| `IdGenerator` | `UuidIdGenerator` (`crypto.randomUUID`) | `FakeIdGenerator` (per-brand sequential, e.g. `test-Person-1`) |
| `EventPublisher` | `InMemoryEventPublisher` (placeholder until a broker adapter) | `InMemoryEventPublisher` / `NoopEventPublisher` |

## Composition root (`src/composition/`)

- `container.ts` — `AppContainer`: the capability set every future use-case is
  constructed against (contracts only, no infrastructure types).
- `production.ts` — `createProductionContainer()` wires the production adapters.
  It does **not** connect a database, initialize authentication, or build any
  product use-case.
- `test.ts` — `createTestContainer()` wires the deterministic adapters and
  exposes their concrete types so tests can advance the clock or assert on
  recorded events.

Presentation obtains a wired container from the composition root; it never
imports adapters directly for business operations.
