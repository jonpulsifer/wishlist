/**
 * Splitting Events into "this year" and "past".
 *
 * The partition used to be written out twice — once in the Secret Santa page
 * and once in the admin event list — on top of three other independent
 * definitions of "current year" elsewhere in the codebase.
 *
 * Pure and client-safe.
 */

export type DatedEvent = { createdAt: Date | string };

export function eventYear(event: DatedEvent): number {
  return new Date(event.createdAt).getFullYear();
}

export function partitionEventsByYear<T extends DatedEvent>(
  events: readonly T[],
  now: Date = new Date(),
): { current: T[]; past: T[]; currentYear: number } {
  const currentYear = now.getFullYear();
  const sorted = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return {
    currentYear,
    current: sorted.filter((event) => eventYear(event) === currentYear),
    past: sorted.filter((event) => eventYear(event) < currentYear),
  };
}
