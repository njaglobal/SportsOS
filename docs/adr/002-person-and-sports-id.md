# ADR 002 — Person and Sports ID

## Status

Accepted

## Date

2026-09-08

## Context

SportsOS requires a permanent identity for every person that survives account
lifecycle changes (password resets, re-registration, soft-delete) and that is
independent of any sport role. The platform must also support minors who may
not have their own login, and must guarantee that historical records never
disappear when an account is deleted (R20). Finally, QR credentials must
identify a person without carrying sensitive data (R8).

The key tension: authentication accounts come and go, but sporting identity
must be permanent and auditable.

## Decision

Separate three concepts:

1. **Person** — the permanent natural/legal identity. Owns the Sports ID.
   Survives account deletion via soft-delete + immutable identity archive.
   Carries `guardianId` for minor/guardian relationships.
2. **User** — an authentication subject (credential holder). Tied to a login
   account; can be disabled/recreated. A minor may have no User; a guardian's
   User acts on their behalf. Never the source of identity.
3. **Sports ID** — a permanent, platform-issued identifier. One per Person
   (R2). Never reissued to another Person. Revocable but never reused.

Additionally:
- A Person has **one** `Athlete` projection (sport-independent — see ADR-003).
- Account "deletion" is soft: disable User, revoke QR credentials, archive
  Person; historical records untouched (R20).
- QR credentials reference the Person by an opaque token; they carry no
  profile data (R8, ADR-007).

See `identity-model.md`.

## Consequences

**Positive:**
- Identity is stable and auditable regardless of account churn.
- Minor/guardian flows are first-class.
- Historical records are safe from account deletion.
- QR trust is decoupled from sensitive data.

**Negative:**
- Slightly more entities to model (Person vs User vs Athlete).
- Must enforce "one Sports ID per Person" and "one Athlete per Person"
  invariants at the application/adapter layer.

## Alternatives considered

- **Single `User` entity holding everything.** Rejected: account deletion
  would orphan history; sport identity would be coupled to login; minors
  would be awkward.
- **Sports ID as a property of Athlete.** Rejected: Sports ID is sport-
  independent (R3) and belongs to the Person, not a sport role.
- **Generate Sports IDs client-side.** Rejected: must be platform-issued to
  guarantee uniqueness and permanence.

## Compliance

- `Person.sportsId` is `SportsId | null` (issued once).
- `Person.guardianId` is `Id<"Person"> | null`.
- Application layer enforces one-Sports-ID-per-Person and one-Athlete-per-Person.
- Soft-delete + archive pattern documented in `audit-integrity.md`.
