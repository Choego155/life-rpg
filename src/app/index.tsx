import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>⚔️</Text>

      <Text style={styles.title}>LIFE RPG</Text>

      <Text style={styles.subtitle}>
        Tu vida es tu partida.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          COMENZAR AVENTURA
        </Text>
      </TouchableOpacity>

      <Text style={styles.version}>
        Versión 0.1
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

  logo: {
    fontSize: 72,
    marginBottom: 20,
  },

  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#F5F5F5',
    letterSpacing: 4,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 18,
    color: '#A5A5B0',
  },

  button: {
    marginTop: 50,
    backgroundColor: '#7C5CFC',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  version: {
    position: 'absolute',
    bottom: 30,
    color: '#5F5F6B',
    fontSize: 12,
  },
});