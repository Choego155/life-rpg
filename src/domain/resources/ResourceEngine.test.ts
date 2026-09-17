import { describe, expect, it } from 'vitest';

import { applyRecoveryAction } from './ResourceEngine';

describe('ResourceEngine', () => {
  it('debe recuperar recursos correctamente al descansar', () => {
    const result = applyRecoveryAction(
      {
        health: 100,
        mana: 70,
        stamina: 60,
      },
      'wizard',
      'rest'
    );

    expect(result).toEqual({
      health: 100,
      mana: 82,
      stamina: 64,
    });
  });

  it('no debe superar el máximo de mana de la clase', () => {
    const result = applyRecoveryAction(
      {
        health: 100,
        mana: 119,
        stamina: 80,
      },
      'wizard',
      'rest'
    );

    expect(result.mana).toBe(120);
  });

  it('no debe permitir recursos negativos', () => {
    const result = applyRecoveryAction(
      {
        health: 100,
        mana: 50,
        stamina: 1,
      },
      'wizard',
      'walk'
    );

    expect(result.stamina).toBe(0);
  });
});