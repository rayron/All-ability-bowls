import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-splash-screen';
import {
  Poppins_400Regular as PoppinsRegular,
  Poppins_500Medium as PoppinsMedium,
  Poppins_600SemiBold as PoppinsSemiBold,
  Poppins_700Bold as PoppinsBold,
} from '@expo-google-fonts/poppins';

import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';

// Only prevent splash screen auto-hide on native platforms
if (Platform.OS !== 'web') {
  // SplashScreen.preventAutoHideAsync();
}

export default function RootLayout() {
  useFrameworkReady();

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': PoppinsRegular,
    'Poppins-Medium': PoppinsMedium,
    'Poppins-SemiBold': PoppinsSemiBold,
    'Poppins-Bold': PoppinsBold,
  });

  // Hide splash screen when fonts are loaded (only on native platforms)
  useEffect(() => {
    if (Platform.OS !== 'web' && (fontsLoaded || fontError)) {
      // SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(onboarding)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}