import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

const tokenCache = {
  getToken: SecureStore.getItemAsync,
  saveToken: SecureStore.setItemAsync,
};

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing CLERK_PUBLISHABLE_KEY');
}

function RedirectToLogin() {
  useEffect(() => {
    router.replace('/auth/login');
  }, []);
  return null;
}

export default function RootLayout() {
  useFrameworkReady();

  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          router.replace('/(tabs)');
        } else {
          router.replace('/auth/login');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        router.replace('/auth/login');
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuthStatus();
  }, []);

  if (!isAuthChecked) return null; // Avoid flicker while checking auth

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
      <SignedIn>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SignedIn>

      <SignedOut>
        <RedirectToLogin />
      </SignedOut>

      <StatusBar style="auto" />
    </ClerkProvider>
  );
}
