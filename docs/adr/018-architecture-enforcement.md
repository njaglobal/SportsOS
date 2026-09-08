# ADR 018 — Architecture Enforcement

## Status

Accepted — **implemented in Sprint 1**.

## Date

2026-09-08 (implemented 2026-09-08, Sprint 1)

## Context

Sprint 0 relied on code review and ESLint `import/no-cycle` for boundary
enforcement. This is insufficient: the critical rules (domain must not import
ports, no cross-context domain internal imports, application must not import
adapters) are not machine-enforced. Human review is error-prone and does not
scale. A CI gate that automatically rejects boundary violations is needed.

## Decision

Add machine-enforced boundary rules using `dependency-cruiser` (or
`eslint-plugin-boundaries` as an alternative) in Sprint 1:

1. **Layer rules:**
   - `@domain` may only import from `@shared` and other `@domain` files.
   - `@app` may import from `@domain`, `@ports`, `@shared`.
   - `@adapters` may import from `@ports`, `@domain`, `@shared`, platform SDKs.
   - `@ports` may import from `@shared` and `@domain` (for type references).
   - `@domain` must NOT import from `@ports` (ADR-016).
   - `@domain` and `@app` must NOT import from `@adapters`.
   - No layer may import platform SDKs except `@adapters`.

2. **Context isolation rules:**
   - A `@domain/<context>/` file must NOT import from another
     `@domain/<other-context>/` directory.
   - Cross-context interaction is via application-layer contracts (ports,
     events, shared IDs), not direct domain imports.

3. **CI gate:**
   - `dependency-cruiser` runs as part of `npm run lint` or a separate
     `npm run arch-check` script.
   - Boundary violations fail the CI build.

4. **Enforcement documentation:**
   - A `docs/architecture/enforcement.md` document (to be created in Sprint 1)
     describes the rules, the tool configuration, and how to resolve
     violations.

**Implemented in Sprint 1.** This ADR documented the decision and planned
rules; the section below records what was actually built.

## Sprint 1 implementation

`dependency-cruiser` (v18) was adopted. Configuration lives in
`.dependency-cruiser.cjs`; it resolves aliases from `tsconfig.app.json` and sets
`tsPreCompilationDeps: true` so rules can distinguish `import type` (type-only,
erased at build) from runtime imports.

Run independently with `npm run architecture:check` (scans `src` only). The same
ruleset is exercised programmatically in `tests/architecture.test.ts`, which
also proves the checker flags a forbidden import fixture
(`tests/fixtures/forbidden-domain/`, outside `src`).

Enforced `error`-severity rules: `no-circular`; `domain-no-app`,
`domain-no-ports`, `domain-no-adapters`, `domain-no-composition`,
`domain-no-presentation`, `domain-no-external-sdk`; `no-cross-context-runtime`;
`app-no-adapters`, `app-no-composition`, `app-no-presentation`,
`app-no-external-sdk`; `presentation-no-adapters`;
`adapters-no-presentation-or-composition`.

**Type-only cross-context decision:** `no-cross-context-runtime` forbids a
domain context importing another context's internals **at runtime** but permits
`import type` references, because types erase at build time and create no
runtime coupling. This keeps the one existing legitimate case (Competition
referencing the Sports `CompetitionMeasure` vocabulary via `import type`) legal
while still blocking all runtime coupling. If a future slice needs a runtime
cross-context value, it must go through an application contract, event, or
shared identifier — not a direct import.

## Consequences

**Positive:**
- Boundary violations are caught automatically, not just by review.
- New developers get immediate feedback on architecture violations.
- The architecture is self-documenting through the rule definitions.

**Negative:**
- Tool configuration requires upfront effort in Sprint 1.
- Some legitimate edge cases (e.g. shared domain types across contexts) may
  require rule exceptions that must be documented.

## Alternatives considered

- **Code review only (Sprint 0).** Rejected: does not scale; error-prone;
  violations slip through.
- **TypeScript project references for isolation.** Rejected: project
  references manage build order, not import restrictions; they cannot enforce
  "domain must not import ports."
- **Custom ESLint rules.** Rejected: high maintenance cost; dependency-cruiser
  and eslint-plugin-boundaries already solve this problem.

## Compliance

- `dependency-cruiser` configuration added at `.dependency-cruiser.cjs`.
- `npm run architecture:check` script added to `package.json`; runnable
  independently of build/lint/test.
- `tests/architecture.test.ts` asserts the real tree has zero error-severity
  violations and that a forbidden-import fixture is flagged.
- CI pipeline should include `architecture:check` as a required gate.
