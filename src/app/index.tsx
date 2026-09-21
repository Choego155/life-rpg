import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { applyRecoveryAction } from '../domain/resources/ResourceEngine';

import {
  finishWorkSessionWithSync,
  startWorkSession,
  syncWorkSession,
  updateResourcesFromWorkSession,
} from '../domain/work/WorkSessionEngine';

import { WorkSession } from '../domain/work/WorkSession';

import {
  PlayerClass,
  PlayerResources,
} from '../domain/player/Player';

import { CLASS_CONFIG } from '../config/classes';

const PLAYER_CLASS: PlayerClass = 'wizard';

const classConfig = CLASS_CONFIG[PLAYER_CLASS];

const INITIAL_RESOURCES: PlayerResources = {
  health: classConfig.maxHealth,
  mana: classConfig.maxMana,
  stamina: classConfig.maxStamina,
};

export default function HomeScreen() {
  const [resources, setResources] =
    useState<PlayerResources>(INITIAL_RESOURCES);

  const [session, setSession] =
    useState<WorkSession | null>(null);

  const [currentTime, setCurrentTime] =
    useState(new Date());

  /*
   * Este reloj solamente actualiza lo que vemos.
   * NO descuenta recursos directamente.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isWorking =
    session?.status === 'working';

  /*
   * Mientras estamos trabajando calculamos
   * cómo deberían verse los recursos AHORA.
   *
   * No estamos modificando todavía
   * los recursos guardados.
   */
  const visibleResources =
    isWorking && session
      ? updateResourcesFromWorkSession(
          resources,
          PLAYER_CLASS,
          session,
          currentTime.toISOString()
        )
      : resources;

  function handleStartWork() {
    const now = new Date();
    const startedAt = now.toISOString();

    const newSession = startWorkSession(
      `session-${Date.now()}`,
      startedAt
    );

    setSession(newSession);
    setCurrentTime(now);
  }

  function handleRest() {
    /*
     * Si estamos trabajando primero calculamos
     * todo el desgaste pendiente.
     */
    if (session?.status === 'working') {
      const now = new Date();

      const synced = syncWorkSession(
        resources,
        PLAYER_CLASS,
        session,
        now.toISOString()
      );

      /*
       * Después aplicamos el descanso.
       */
      const recoveredResources =
        applyRecoveryAction(
          synced.resources,
          PLAYER_CLASS,
          'rest'
        );

      setResources(recoveredResources);
      setSession(synced.session);
      setCurrentTime(now);

      return;
    }

    /*
     * Si no estamos trabajando simplemente
     * recuperamos recursos.
     */
    setResources((currentResources) =>
      applyRecoveryAction(
        currentResources,
        PLAYER_CLASS,
        'rest'
      )
    );
  }

  function handleFinishWork() {
    if (
      !session ||
      session.status !== 'working'
    ) {
      return;
    }

    const now = new Date();

    const result =
      finishWorkSessionWithSync(
        resources,
        PLAYER_CLASS,
        session,
        now.toISOString()
      );

    setResources(result.resources);
    setSession(result.session);
    setCurrentTime(now);
  }

  function formatElapsedTime(): string {
    if (!session?.startedAt) {
      return '00:00:00';
    }

    const start =
      new Date(session.startedAt).getTime();

    const end =
      session.status === 'finished' &&
      session.finishedAt
        ? new Date(session.finishedAt).getTime()
        : currentTime.getTime();

    const totalSeconds = Math.max(
      0,
      Math.floor((end - start) / 1000)
    );

    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const seconds =
      totalSeconds % 60;

    return [
      hours,
      minutes,
      seconds,
    ]
      .map((value) =>
        String(value).padStart(2, '0')
      )
      .join(':');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ⚔️ LIFE RPG
      </Text>

      <Text style={styles.className}>
        {classConfig.name} · Nivel 1
      </Text>

      <View style={styles.character}>
        <Text style={styles.characterEmoji}>
          🧙‍♂️
        </Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.health}>
          ❤️ Vida:{' '}
          {Math.round(
            visibleResources.health
          )}{' '}
          / {classConfig.maxHealth}
        </Text>

        <Text style={styles.mana}>
          🔮 Maná:{' '}
          {Math.round(
            visibleResources.mana
          )}{' '}
          / {classConfig.maxMana}
        </Text>

        <Text style={styles.stamina}>
          ⚡ Estamina:{' '}
          {Math.round(
            visibleResources.stamina
          )}{' '}
          / {classConfig.maxStamina}
        </Text>
      </View>

      {session && (
        <View style={styles.sessionPanel}>
          <Text style={styles.sessionStatus}>
            {session.status === 'working'
              ? '⚒️ Trabajando'
              : '🌙 Jornada finalizada'}
          </Text>

          <Text style={styles.timer}>
            {formatElapsedTime()}
          </Text>
        </View>
      )}

      {!isWorking && (
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartWork}
        >
          <Text style={styles.buttonText}>
            ⚔️ INICIAR JORNADA
          </Text>
        </TouchableOpacity>
      )}

      {isWorking && (
        <>
          <TouchableOpacity
            style={styles.restButton}
            onPress={handleRest}
          >
            <Text style={styles.buttonText}>
              💤 DESCANSAR
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishWork}
          >
            <Text style={styles.buttonText}>
              🏁 FINALIZAR JORNADA
            </Text>
          </TouchableOpacity>
        </>
      )}

      {!isWorking && (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleRest}
        >
          <Text style={styles.buttonText}>
            💤 DESCANSAR
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.note}>
        Prototipo del sistema de jornada
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
    marginVertical: 25,
  },

  characterEmoji: {
    fontSize: 100,
  },

  stats: {
    width: '100%',
    gap: 12,
    marginBottom: 25,
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

  sessionPanel: {
    width: '100%',
    backgroundColor: '#1D1D26',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },

  sessionStatus: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  timer: {
    color: '#A5A5B0',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },

  startButton: {
    backgroundColor: '#2F7D45',
    width: '100%',
    padding: 17,
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
    marginBottom: 12,
  },

  finishButton: {
    backgroundColor: '#9C3D3D',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  secondaryButton: {
    backgroundColor: '#3A3A46',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  note: {
    marginTop: 25,
    color: '#656573',
    fontSize: 12,
  },
});