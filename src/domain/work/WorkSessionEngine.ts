import { CLASS_CONFIG } from '../../config/classes';
import {
    PlayerClass,
    PlayerResources,
} from '../player/Player';
import { WorkSession } from './WorkSession';

function clampMin(value: number, min: number): number {
  return Math.max(min, value);
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function applyWorkDrain(
  resources: PlayerResources,
  playerClass: PlayerClass,
  elapsedMinutes: number
): PlayerResources {
  const classConfig = CLASS_CONFIG[playerClass];

  const elapsedHours = elapsedMinutes / 60;

  const manaDrain =
    classConfig.manaDrainPerHour * elapsedHours;

  const staminaDrain =
    classConfig.staminaDrainPerHour * elapsedHours;

  return {
    health: resources.health,

    mana: roundToTwoDecimals(
      clampMin(resources.mana - manaDrain, 0)
    ),

    stamina: roundToTwoDecimals(
      clampMin(resources.stamina - staminaDrain, 0)
    ),
  };
}

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
export function startWorkSession(
  id: string,
  startedAt: string
): WorkSession {
  return {
    id,
    status: 'working',
    startedAt,
    lastUpdatedAt: startedAt,
    finishedAt: null,
  };
}

export function finishWorkSession(
  session: WorkSession,
  finishedAt: string
): WorkSession {
  return {
    ...session,
    status: 'finished',
    lastUpdatedAt: finishedAt,
    finishedAt,
  };
}
export function updateResourcesFromWorkSession(
  resources: PlayerResources,
  playerClass: PlayerClass,
  session: WorkSession,
  currentTime: string
): PlayerResources {
  if (
    session.status !== 'working' ||
    session.lastUpdatedAt === null
  ) {
    return resources;
  }

  const elapsedMinutes = getElapsedMinutes(
    session.lastUpdatedAt,
    currentTime
  );

  return applyWorkDrain(
    resources,
    playerClass,
    elapsedMinutes
  );
}

export type WorkSessionSyncResult = {
  resources: PlayerResources;
  session: WorkSession;
};

export function syncWorkSession(
  resources: PlayerResources,
  playerClass: PlayerClass,
  session: WorkSession,
  currentTime: string
): WorkSessionSyncResult {
  if (
    session.status !== 'working' ||
    session.lastUpdatedAt === null
  ) {
    return {
      resources,
      session,
    };
  }

  const elapsedMinutes = getElapsedMinutes(
    session.lastUpdatedAt,
    currentTime
  );

  if (elapsedMinutes <= 0) {
    return {
      resources,
      session,
    };
  }

  const updatedResources = applyWorkDrain(
    resources,
    playerClass,
    elapsedMinutes
  );

  const updatedSession: WorkSession = {
    ...session,
    lastUpdatedAt: currentTime,
  };

  return {
    resources: updatedResources,
    session: updatedSession,
  };
}