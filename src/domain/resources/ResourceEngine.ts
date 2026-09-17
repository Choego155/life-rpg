import { RECOVERY_ACTIONS, RecoveryActionId } from '../../config/actions';
import { CLASS_CONFIG } from '../../config/classes';
import {
    PlayerClass,
    PlayerResources,
} from '../player/Player';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function applyRecoveryAction(
  resources: PlayerResources,
  playerClass: PlayerClass,
  actionId: RecoveryActionId
): PlayerResources {
  const action = RECOVERY_ACTIONS[actionId];
  const classConfig = CLASS_CONFIG[playerClass];

  return {
    health: clamp(
      resources.health + action.healthChange,
      0,
      classConfig.maxHealth
    ),

    mana: clamp(
      resources.mana + action.manaChange,
      0,
      classConfig.maxMana
    ),

    stamina: clamp(
      resources.stamina + action.staminaChange,
      0,
      classConfig.maxStamina
    ),
  };
}