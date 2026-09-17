export type PlayerClass =
  | 'wizard'
  | 'bard'
  | 'warrior'
  | 'artificer'
  | 'explorer';

export type PlayerResources = {
  health: number;
  mana: number;
  stamina: number;
};

export type Player = {
  id: string;

  name: string;

  playerClass: PlayerClass;

  level: number;
  xp: number;
  coins: number;

  resources: PlayerResources;

  createdAt: string;
};