import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/clerk-expo';
import { useCallback, useEffect } from 'react';
import { Alert, View } from 'react-native';
import GithubIconButton from './GithubIconButton';
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

export default function SignInWithGithub() {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_github',
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
          'GitHub Account Not Linked',
          'No Clerk account is linked to this GitHub account. Please sign up first.'
        );
        router.push('/sign-up');
      } else if (signUp?.status === 'missing_requirements') {
        Alert.alert(
          'GitHub Sign Up Incomplete',
          'Your GitHub sign up is incomplete. Finish sign up in the browser or contact support.'
        );
        router.push('/sign-up');
      } else {
        Alert.alert(
          'GitHub Sign In Failed',
          'We couldn’t sign you in with GitHub. Please try again or use another method.'
        );
        router.push('/sign-in');
      }

      console.warn('GitHub sign-in incomplete:', { signIn, signUp });
    } catch (err: any) {
      // console.error('❌ GitHub sign-in error:', err);

      let message = 'An unexpected GitHub authentication error occurred.';

      if (err?.message?.includes('cancelled')) {
        message = 'You cancelled the GitHub sign-in process.';
      } else if (err?.message?.includes('network')) {
        message = 'Network issue during GitHub sign-in. Check your connection.';
      } else if (err?.message) {
        message = `GitHub sign-in failed: ${err.message}`;
      }

      Alert.alert('GitHub Authentication Error', message);
      router.push('/sign-up');
    }
  }, []);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
      <GithubIconButton onPress={onPress} />
    </View>
  );
}
