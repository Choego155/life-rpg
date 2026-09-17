import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { PlayerResources } from '../domain/player/Player';
import { applyRecoveryAction } from '../domain/resources/ResourceEngine';
import { applyWorkDrain } from '../domain/work/WorkSessionEngine';

export default function HomeScreen() {
  const [resources, setResources] = useState<PlayerResources>({
    health: 100,
    mana: 120,
    stamina: 80,
  });

  function workOneHour() {
    const newResources = applyWorkDrain(
      resources,
      'wizard',
      60
    );

    setResources(newResources);
  }

  function rest() {
    const newResources = applyRecoveryAction(
      resources,
      'wizard',
      'rest'
    );

    setResources(newResources);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔️ LIFE RPG</Text>

      <Text style={styles.className}>Hechicero · Nivel 1</Text>

      <View style={styles.character}>
        <Text style={styles.characterEmoji}>🧙‍♂️</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.health}>
          ❤️ Vida: {resources.health} / 100
        </Text>

        <Text style={styles.mana}>
          🔮 Maná: {Math.round(resources.mana)} / 120
        </Text>

        <Text style={styles.stamina}>
          ⚡ Estamina: {Math.round(resources.stamina)} / 80
        </Text>
      </View>

      <TouchableOpacity
        style={styles.workButton}
        onPress={workOneHour}
      >
        <Text style={styles.buttonText}>
          ⚒️ SIMULAR 1 HORA DE TRABAJO
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.restButton}
        onPress={rest}
      >
        <Text style={styles.buttonText}>
          💤 DESCANSAR
        </Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Demo temporal del motor de recursos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121218',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },

  className: {
    marginTop: 8,
    color: '#A5A5B0',
    fontSize: 16,
  },

  character: {
    marginVertical: 35,
  },

  characterEmoji: {
    fontSize: 100,
  },

  stats: {
    width: '100%',
    gap: 12,
    marginBottom: 35,
  },

  health: {
    color: '#FF6B6B',
    fontSize: 20,
    fontWeight: 'bold',
  },

  mana: {
    color: '#8EA7FF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  stamina: {
    color: '#FFD166',
    fontSize: 20,
    fontWeight: 'bold',
  },

  workButton: {
    backgroundColor: '#7C5CFC',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },

  restButton: {
    backgroundColor: '#3A3A46',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  note: {
    marginTop: 30,
    color: '#656573',
    fontSize: 12,
  },
});