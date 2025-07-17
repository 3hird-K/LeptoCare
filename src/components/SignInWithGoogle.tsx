import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/clerk-expo';
import { useCallback, useEffect } from "react";
import { Alert, View } from "react-native";
import GoogleIconButton from './GoogleIconButton';
import { router } from 'expo-router';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInWithGoogle() {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: 'leptocare',
        }),
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        return;
      }

      if (signIn?.status === 'needs_identifier') {
        Alert.alert(
          'Email Not Registered',
          'No account found for this email. Please sign up first or use a different account.'
        );
        router.push('/sign-up');
      } else if (signUp?.status === 'missing_requirements') {
        Alert.alert(
          'Incomplete Sign Up',
          'Please complete sign up in the browser or contact support.'
        );
        router.push('/sign-up');
      } else {
        Alert.alert(
          'Sign In Failed',
          'Something went wrong. Please try again or use a different method.'
        );
        router.push('/sign-up');
      }

      console.warn('Sign-in incomplete:', { signIn, signUp });
    } catch (err: any) {
      // console.error('❌ Sign-in error:', err);

      let message = 'An unexpected error occurred. Please try again.';

      if (err?.message?.includes('cancelled')) {
        message = 'Sign-in was cancelled.';
      } else if (err?.message?.includes('network')) {
        message = 'Network error. Please check your internet connection.';
      } else if (err?.message) {
        message = err.message;
      }

      Alert.alert('Authentication Error', message);
      router.push('/sign-up');
    }
  }, []);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
      <GoogleIconButton onPress={onPress} />
    </View>
  );
}
