import { db } from '../database/database';

import {
    Player,
    PlayerClass,
    PlayerResources,
} from '../../domain/player/Player';

type PlayerRow = {
  id: string;
  name: string;
  player_class: PlayerClass;
  level: number;
  xp: number;
  coins: number;
  created_at: string;
};

type PlayerResourcesRow = {
  player_id: string;
  health: number;
  mana: number;
  stamina: number;
  updated_at: string;
};

export function savePlayer(player: Player): void {
  db.runSync(
    `
      INSERT OR REPLACE INTO player (
        id,
        name,
        player_class,
        level,
        xp,
        coins,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    player.id,
    player.name,
    player.playerClass,
    player.level,
    player.xp,
    player.coins,
    player.createdAt
  );

  db.runSync(
    `
      INSERT OR REPLACE INTO player_resources (
        player_id,
        health,
        mana,
        stamina,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    player.id,
    player.resources.health,
    player.resources.mana,
    player.resources.stamina,
    new Date().toISOString()
  );
}

export function getPlayer(playerId: string): Player | null {
  const playerRow = db.getFirstSync<PlayerRow>(
    `
      SELECT
        id,
        name,
        player_class,
        level,
        xp,
        coins,
        created_at
      FROM player
      WHERE id = ?
    `,
    playerId
  );

  if (!playerRow) {
    return null;
  }

  const resourcesRow =
    db.getFirstSync<PlayerResourcesRow>(
      `
        SELECT
          player_id,
          health,
          mana,
          stamina,
          updated_at
        FROM player_resources
        WHERE player_id = ?
      `,
      playerId
    );

  if (!resourcesRow) {
    return null;
  }

  const resources: PlayerResources = {
    health: resourcesRow.health,
    mana: resourcesRow.mana,
    stamina: resourcesRow.stamina,
  };

  return {
    id: playerRow.id,
    name: playerRow.name,
    playerClass: playerRow.player_class,
    level: playerRow.level,
    xp: playerRow.xp,
    coins: playerRow.coins,
    resources,
    createdAt: playerRow.created_at,
  };
}