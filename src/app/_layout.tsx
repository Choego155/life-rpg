import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

import { initializeDatabase } from '@/data/database/database';

SplashScreen.preventAutoHideAsync();

/*
 * Inicializamos la base de datos antes de que
 * las pantallas de la aplicación se rendericen.
 *
 * CREATE TABLE IF NOT EXISTS hace que podamos
 * ejecutar esto cada vez que inicia la app
 * sin borrar información existente.
 */
initializeDatabase();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}