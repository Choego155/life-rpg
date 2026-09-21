import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { CLASS_CONFIG } from '../config/classes';

import {
  Player,
  PlayerResources,
} from '../domain/player/Player';

import { applyRecoveryAction } from '../domain/resources/ResourceEngine';

import { WorkSession } from '../domain/work/WorkSession';

import {
  finishWorkSessionWithSync,
  pauseWorkSessionWithSync,
  resumeWorkSession,
  startWorkSession,
  updateResourcesFromWorkSession,
} from '../domain/work/WorkSessionEngine';
import { loadOrCreatePlayer } from '../features/player/PlayerService';

export default function HomeScreen() {
  const [player, setPlayer] =
    useState<Player | null>(null);

  const [resources, setResources] =
    useState<PlayerResources | null>(null);

  const [session, setSession] =
    useState<WorkSession | null>(null);

  const [currentTime, setCurrentTime] =
    useState(new Date());

  /*
   * Al abrir la pantalla:
   * 1. Busca al jugador en SQLite.
   * 2. Si no existe, lo crea.
   * 3. Carga sus recursos.
   */
  useEffect(() => {
    const loadedPlayer =
      loadOrCreatePlayer();

    setPlayer(loadedPlayer);
    setResources(loadedPlayer.resources);
  }, []);

  /*
   * Reloj visual de la aplicación.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /*
   * Mientras SQLite carga al jugador
   * mostramos una pantalla sencilla.
   */
  if (!player || !resources) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>
          Cargando aventurero...
        </Text>
      </View>
    );
  }

  const classConfig =
    CLASS_CONFIG[player.playerClass];

  const isWorking =
    session?.status === 'working';

  const isOnBreak =
    session?.status === 'break';

  const canStart =
    !session ||
    session.status === 'finished';

  /*
   * Si estamos trabajando, calculamos
   * visualmente el desgaste en tiempo real.
   */
  const visibleResources =
    isWorking && session
      ? updateResourcesFromWorkSession(
          resources,
          player.playerClass,
          session,
          currentTime.toISOString()
        )
      : resources;

function handleStartWork() {
  if (!player || !resources) {
    return;
  }

  const now = new Date();

  const newSession = startWorkSession(
    `session-${Date.now()}`,
    now.toISOString()
  );

  setSession(newSession);
  setCurrentTime(now);
}


function handleResumeWork() {
  if (
    !session ||
    session.status !== 'break'
  ) {
    return;
  }

  const now = new Date();

  const resumedSession =
    resumeWorkSession(
      session,
      now.toISOString()
    );

  setSession(resumedSession);
  setCurrentTime(now);
}

 function handlePauseWork() {
  if (
    !player ||
    !resources ||
    !session ||
    session.status !== 'working'
  ) {
    return;
  }

  const now = new Date();

  const result = pauseWorkSessionWithSync(
    resources,
    player.playerClass,
    session,
    now.toISOString()
  );

  setResources(result.resources);
  setSession(result.session);
  setCurrentTime(now);
}
  function handleRest() {
  if (
    !player ||
    !resources ||
    !isOnBreak
  ) {
    return;
  }

  const recoveredResources =
    applyRecoveryAction(
      resources,
      player.playerClass,
      'rest'
    );

  setResources(recoveredResources);
}

  function handleFinishWork() {
  if (
    !player ||
    !resources ||
    !session ||
    (
      session.status !== 'working' &&
      session.status !== 'break'
    )
  ) {
    return;
  }

  const now = new Date();

  const result =
    finishWorkSessionWithSync(
      resources,
      player.playerClass,
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
      new Date(
        session.startedAt
      ).getTime();

    const end =
      session.status === 'finished' &&
      session.finishedAt
        ? new Date(
            session.finishedAt
          ).getTime()
        : currentTime.getTime();

    const totalSeconds = Math.max(
      0,
      Math.floor(
        (end - start) / 1000
      )
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

  function getSessionLabel(): string {
    if (!session) {
      return '';
    }

    if (session.status === 'working') {
      return '⚒️ Trabajando';
    }

    if (session.status === 'break') {
      return '☕ En descanso';
    }

    return '🌙 Jornada finalizada';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ⚔️ LIFE RPG
      </Text>

      <Text style={styles.playerName}>
        {player.name}
      </Text>

      <Text style={styles.className}>
        {classConfig.name} · Nivel {player.level}
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
            {getSessionLabel()}
          </Text>

          <Text style={styles.timer}>
            {formatElapsedTime()}
          </Text>
        </View>
      )}

      {canStart && (
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
            onPress={handlePauseWork}
          >
            <Text style={styles.buttonText}>
              ☕ TOMAR DESCANSO
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

      {isOnBreak && (
        <>
          <TouchableOpacity
            style={styles.recoveryButton}
            onPress={handleRest}
          >
            <Text style={styles.buttonText}>
              💤 DESCANSAR
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleResumeWork}
          >
            <Text style={styles.buttonText}>
              ⚒️ REANUDAR JORNADA
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

      <Text style={styles.note}>
        Personaje cargado desde SQLite
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

  loading: {
    color: '#FFFFFF',
    fontSize: 18,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },

  playerName: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  className: {
    marginTop: 4,
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
    backgroundColor: '#795C34',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },

  recoveryButton: {
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
    marginBottom: 12,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  note: {
    marginTop: 15,
    color: '#656573',
    fontSize: 12,
  },
});