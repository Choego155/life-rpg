import { PlayerClass } from '../domain/player/Player';

export type ClassConfig = {
  id: PlayerClass;
  name: string;
  description: string;

  maxHealth: number;
  maxMana: number;
  maxStamina: number;

  manaDrainPerHour: number;
  staminaDrainPerHour: number;
};

export const CLASS_CONFIG: Record<PlayerClass, ClassConfig> = {
  wizard: {
    id: 'wizard',
    name: 'Hechicero',
    description: 'Especialista en trabajos mentales y de concentración.',

    maxHealth: 100,
    maxMana: 120,
    maxStamina: 80,

    manaDrainPerHour: 8,
    staminaDrainPerHour: 2,
  },

  bard: {
    id: 'bard',
    name: 'Bardo',
    description: 'Especialista en comunicación e interacción social.',

    maxHealth: 100,
    maxMana: 110,
    maxStamina: 90,

    manaDrainPerHour: 7,
    staminaDrainPerHour: 3,
  },

  warrior: {
    id: 'warrior',
    name: 'Guerrero',
    description: 'Especialista en trabajos físicos y esfuerzo constante.',

    maxHealth: 110,
    maxMana: 70,
    maxStamina: 130,

    manaDrainPerHour: 2,
    staminaDrainPerHour: 9,
  },

  artificer: {
    id: 'artificer',
    name: 'Artífice',
    description: 'Especialista en trabajos técnicos y manuales.',

    maxHealth: 105,
    maxMana: 90,
    maxStamina: 110,

    manaDrainPerHour: 4,
    staminaDrainPerHour: 6,
  },

  explorer: {
    id: 'explorer',
    name: 'Explorador',
    description: 'Especialista en trabajos con movimiento constante.',

    maxHealth: 100,
    maxMana: 90,
    maxStamina: 120,

    manaDrainPerHour: 4,
    staminaDrainPerHour: 7,
  },
};