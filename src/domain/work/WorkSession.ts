export type WorkSessionStatus =
  | 'idle'
  | 'working'
  | 'break'
  | 'finished';

export type WorkSession = {
  id: string;

  status: WorkSessionStatus;

  startedAt: string | null;
  lastUpdatedAt: string | null;
  finishedAt: string | null;
};

export function getElapsedMinutes(
  from: string,
  to: string
): number {
  const fromTime = new Date(from).getTime();
  const toTime = new Date(to).getTime();

  const elapsedMilliseconds = toTime - fromTime;
  const elapsedMinutes = elapsedMilliseconds / 1000 / 60;

  return Math.max(0, elapsedMinutes);
}