import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('life-rpg.db');

export function initializeDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS player (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      player_class TEXT NOT NULL,

      level INTEGER NOT NULL DEFAULT 1,
      xp INTEGER NOT NULL DEFAULT 0,
      coins INTEGER NOT NULL DEFAULT 0,

      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS player_resources (
      player_id TEXT PRIMARY KEY NOT NULL,

      health REAL NOT NULL,
      mana REAL NOT NULL,
      stamina REAL NOT NULL,

      updated_at TEXT NOT NULL,

      FOREIGN KEY (player_id)
        REFERENCES player(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS work_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      player_id TEXT NOT NULL,

      status TEXT NOT NULL,

      started_at TEXT,
      last_updated_at TEXT,
      finished_at TEXT,

      FOREIGN KEY (player_id)
        REFERENCES player(id)
        ON DELETE CASCADE
    );
  `);
}