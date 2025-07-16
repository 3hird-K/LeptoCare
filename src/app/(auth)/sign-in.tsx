import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomInput from '@/components/CustomInput';
import CustomBtn from '@/components/CustomBtn';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import {
  isClerkAPIResponseError,
  useSignIn,
} from '@clerk/clerk-expo';
import { useState } from 'react';

const signInSchema = z.object({
  identifier: z.string().min(1, 'Email or Username is required'),
  password: z
    .string({ message: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long'),
});

type SignInFields = z.infer<typeof signInSchema>;

const mapClerkErrorToFormField = (error: any) => {
  switch (error.meta?.paramName) {
    case 'identifier':
      return 'identifier';
    case 'password':
      return 'password';
    default:
      return 'root';
  }
};

export default function SignInScreen() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
  });

  const onSignIn = async (data: SignInFields) => {
    if (!isLoaded || loading) return;

    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        setError('root', {
          message: 'Unexpected authentication flow. Please try again.',
        });
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        err.errors.forEach((error) => {
          const field = mapClerkErrorToFormField(error);
          setError(field as any, { message: error.message });
        });
      } else {
        setError('root', {
          message:
            'Something went wrong while signing in. Please check your connection and try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Login Account</Text>

      <View style={styles.form}>
        <CustomInput
          control={control}
          name="identifier"
          placeholder="Email or Username"
          autoFocus
          autoCapitalize="none"
        />
        <CustomInput
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry
        />

        {errors.root && (
          <Text style={styles.rootError}>{errors.root.message}</Text>
        )}
      </View>

      <CustomBtn
        onPress={handleSubmit(onSignIn)}
        text={loading ? 'Logging in...' : 'Login'}
        disabled={loading}
      />

      <Link href="/sign-up" style={styles.link}>
        Don’t have an account? Sign up
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    gap: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    gap: 10,
  },
  link: {
    color: '#4353Fd',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  rootError: {
    color: 'crimson',
    marginTop: 5,
    fontSize: 14,
  },
});
