import { describe, expect, it } from 'vitest';

import { applyWorkDrain } from './WorkSessionEngine';

describe('WorkSessionEngine', () => {
  it('debe gastar correctamente los recursos de un hechicero durante 1 hora', () => {
    const result = applyWorkDrain(
      {
        health: 100,
        mana: 120,
        stamina: 80,
      },
      'wizard',
      60
    );

    expect(result).toEqual({
      health: 100,
      mana: 112,
      stamina: 78,
    });
  });

  it('debe calcular correctamente media hora de trabajo', () => {
    const result = applyWorkDrain(
      {
        health: 100,
        mana: 120,
        stamina: 80,
      },
      'wizard',
      30
    );

    expect(result).toEqual({
      health: 100,
      mana: 116,
      stamina: 79,
    });
  });

  it('un guerrero debe gastar más estamina que mana', () => {
    const result = applyWorkDrain(
      {
        health: 110,
        mana: 70,
        stamina: 130,
      },
      'warrior',
      60
    );

    expect(result).toEqual({
      health: 110,
      mana: 68,
      stamina: 121,
    });
  });

  it('los recursos nunca deben bajar de cero', () => {
    const result = applyWorkDrain(
      {
        health: 100,
        mana: 3,
        stamina: 2,
      },
      'wizard',
      600
    );

    expect(result.mana).toBe(0);
    expect(result.stamina).toBe(0);
  });

  it('debe mantener la vida sin cambios durante el trabajo', () => {
    const result = applyWorkDrain(
      {
        health: 73,
        mana: 100,
        stamina: 70,
      },
      'explorer',
      120
    );

    expect(result.health).toBe(73);
  });
});