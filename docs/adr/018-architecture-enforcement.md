# ADR 018 — Architecture Enforcement

## Status

Accepted (implementation deferred to Sprint 1)

## Date

2026-09-08

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

**Implementation is deferred to Sprint 1.** This ADR documents the decision
and the planned rules so Sprint 1 can implement them without ambiguity.

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

- This ADR is the planning document; implementation occurs in Sprint 1.
- `dependency-cruiser` configuration (`.dependency-cruiser.js`) will be added
  in Sprint 1.
- `npm run arch-check` script will be added to `package.json` in Sprint 1.
- CI pipeline will include the architecture check as a required gate.
