import { Slot } from 'expo-router';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { useEffect, useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import '../i18n/config';
import { setLanguageForUser } from '@/i18n/config';

function AppWrapper() {
  const { isSignedIn, userId, isLoaded } = useAuth();

  useEffect(() => {
    const applyUserLanguage = async () => {
      if (isLoaded && isSignedIn && userId) {
        await setLanguageForUser(userId); // Load language for current user
      }
    };
    applyUserLanguage();
  }, [isSignedIn, userId, isLoaded]);

  return <Slot />;
}

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // simulate loading
      setAppReady(true);
    };
    prepare();
  }, []);

  if (!isAppReady) {
    return <SplashScreen />;
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ActionSheetProvider>
        <AppWrapper />
      </ActionSheetProvider>
    </ClerkProvider>
  );
}
