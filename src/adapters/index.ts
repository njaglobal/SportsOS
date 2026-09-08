/**
 * Adapter registry. This is the ONLY place infrastructure is imported.
 * In this architecture sprint adapters are stubs that throw — their presence
 * documents the port/adapter seam. Real adapters arrive in later sprints.
 */

export class NotConfiguredError extends Error {
  constructor(port: string) {
    super(`Port "${port}" has no configured adapter in this sprint.`);
    this.name = "NotConfiguredError";
  }
}
