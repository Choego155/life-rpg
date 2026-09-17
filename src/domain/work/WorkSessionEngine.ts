import { CLASS_CONFIG } from '../../config/classes';
import {
    PlayerClass,
    PlayerResources,
} from '../player/Player';

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