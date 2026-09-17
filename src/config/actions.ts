export type RecoveryActionId =
  | 'drink_water'
  | 'walk'
  | 'rest'
  | 'eat';

export type RecoveryAction = {
  id: RecoveryActionId;
  name: string;
  description: string;

  healthChange: number;
  manaChange: number;
  staminaChange: number;
};

export const RECOVERY_ACTIONS: Record<RecoveryActionId, RecoveryAction> = {
  drink_water: {
    id: 'drink_water',
    name: 'Beber agua',
    description: 'Tómate un momento para hidratarte.',

    healthChange: 0,
    manaChange: 3,
    staminaChange: 0,
  },

  walk: {
    id: 'walk',
    name: 'Caminar',
    description: 'Camina durante unos minutos para despejarte.',

    healthChange: 0,
    manaChange: 8,
    staminaChange: -2,
  },

  rest: {
    id: 'rest',
    name: 'Descansar',
    description: 'Tómate una pausa para recuperar energía mental.',

    healthChange: 0,
    manaChange: 12,
    staminaChange: 4,
  },

  eat: {
    id: 'eat',
    name: 'Comer',
    description: 'Recupera energía después de comer.',

    healthChange: 0,
    manaChange: 2,
    staminaChange: 10,
  },
};