# ADR 007 — QR Credential Security

## Status

Accepted

## Date

2026-09-08

## Context

SportsOS uses QR codes for identity (permanent Sports ID) and event access
(dynamic event credentials). QR codes are easily photographed or leaked. They
must identify a person **without** carrying sensitive profile data (R8).
Permanent identity QR and temporary event credentials are different trust
objects with different lifecycles (R9). QR identity, biometric/device auth,
and identity verification are distinct concepts that compose but do not imply
each other (R10).

## Decision

1. **Two credential kinds**, discriminated by `QrCredentialKind`:
   - `permanent_sports_id` — long-lived, person-scoped, tied to the Sports ID.
   - `event_credential` — short-lived, event-scoped, dynamically rotatable.
2. **A QR encodes only an opaque `payloadToken`.** It contains no name, DOB,
   contact, or health data. The token is resolved server-side to a Person
   (and, for event credentials, an Event).
3. **Three independent trust concepts:**
   - QR identity (which person) — server-side token resolution.
   - Biometric/device auth (device unlocked by owner) — `BiometricsPort`.
   - Identity verification (self / document / verified) —
     `IdentityVerification.level`.
   None implies another; they compose for high-trust flows.
4. **Rotation and revocation** are first-class: `rotatedAt`, `revoked`. A
   revoked token resolves to "revoked" server-side and grants nothing.
5. On account soft-delete, active QR credentials are revoked; identity
   archive and historical records persist (R20).

See `qr-credentials-model.md`, `identity-model.md`.

## Consequences

**Positive:**
- A leaked QR reveals nothing useful (opaque token only).
- Permanent vs event trust is cleanly separated.
- High-trust flows can require all three concepts independently.
- Revocation/rotation is safe and non-destructive.

**Negative:**
- Every scan requires a server round-trip to resolve the token (acceptable;
  offline event workflows use pre-downloaded rosters — see
  `offline-resilience.md`).
- Token generation must be unguessable (use the `IdGenerator` / crypto-secure
  adapter).

## Alternatives considered

- **Embed profile data in the QR for offline convenience.** Rejected:
  violates R8; leaked QR exposes sensitive data.
- **Single QR for both identity and event access.** Rejected: violates R9;
  event-specific trust would leak into permanent identity.
- **Biometric unlock implies identity verification.** Rejected: violates R10;
  a biometric proves device possession, not verified identity.

## Compliance

- `QrCredential.payloadToken` is opaque; no profile fields on the credential.
- `QrCredentialKind` discriminates permanent vs event.
- `IdentityVerificationLevel` is checked independently of QR/biometrics for
  high-trust permissions.
