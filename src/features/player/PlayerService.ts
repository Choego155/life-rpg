import { CLASS_CONFIG } from '../../config/classes';

import {
    getPlayer,
    savePlayer,
} from '../../data/repositories/PlayerRepository';

import { Player } from '../../domain/player/Player';

const DEFAULT_PLAYER_ID = 'player-001';

export function loadOrCreatePlayer(): Player {
  const existingPlayer = getPlayer(DEFAULT_PLAYER_ID);

  if (existingPlayer) {
    return existingPlayer;
  }

  const playerClass = 'wizard';

  const classConfig =
    CLASS_CONFIG[playerClass];

  const newPlayer: Player = {
    id: DEFAULT_PLAYER_ID,

    name: 'Aventurero',

    playerClass,

    level: 1,
    xp: 0,
    coins: 0,

    resources: {
      health: classConfig.maxHealth,
      mana: classConfig.maxMana,
      stamina: classConfig.maxStamina,
    },

    createdAt: new Date().toISOString(),
  };

  savePlayer(newPlayer);

  return newPlayer;
}