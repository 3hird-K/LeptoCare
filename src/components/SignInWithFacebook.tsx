import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/clerk-expo';
import { useCallback, useEffect } from 'react';
import { Alert, View } from 'react-native';
import FacebookIconButton from './FacebookIconButton'; 
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

export default function SignInWithFacebook() {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_facebook',
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
          'Facebook Account Not Linked',
          'No Clerk account is linked to this Facebook account. Please sign up first.'
        );
        router.push('/sign-up');
      } else if (signUp?.status === 'missing_requirements') {
        Alert.alert(
          'Facebook Sign Up Incomplete',
          'Your Facebook sign up is incomplete. Finish sign up in the browser or contact support.'
        );
        router.push('/sign-up');
      } else {
        Alert.alert(
          'Facebook Sign In Failed',
          'We couldn’t sign you in with Facebook. Please try again or use another method.'
        );
        router.push('/sign-in');
      }

      console.warn('Facebook sign-in incomplete:', { signIn, signUp });
    } catch (err: any) {
    //   console.error('❌ Facebook sign-in error:', err);

      let message = 'An unexpected Facebook authentication error occurred.';

      if (err?.message?.includes('cancelled')) {
        message = 'You cancelled the Facebook sign-in process.';
      } else if (err?.message?.includes('network')) {
        message = 'Network issue during Facebook sign-in. Check your connection.';
      } else if (err?.message) {
        message = `Facebook sign-in failed: ${err.message}`;
      }

      Alert.alert('Facebook Authentication Error', message);
      router.push('/sign-up');
    }
  }, []);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
      <FacebookIconButton onPress={onPress} />
    </View>
  );
}
