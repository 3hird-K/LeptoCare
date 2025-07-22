// app/_layout.tsx
import { Slot } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { useEffect, useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import '../i18n/config'; 

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
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
        <Slot />
      </ActionSheetProvider>
    </ClerkProvider>
  );
}
