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