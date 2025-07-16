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
import { router } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';

const verifySchema = z.object({
  code: z
    .string({ message: 'Code is required' })
    .length(6, 'Verification code must be 6 digits'),
});

type VerifyFields = z.infer<typeof verifySchema>;

export default function VerifyEmailScreen() {
  const { signUp, isLoaded } = useSignUp();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<VerifyFields>({
    resolver: zodResolver(verifySchema),
  });

  const onVerify = async ({ code }: VerifyFields) => {
    if (!isLoaded || loading) return;

    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === 'complete') {
        console.log('Verification Successful');
        router.replace('/');
      } else {
        console.log('Verification Failed');
        setError('root', {
          message: 'Verification failed. Please double-check your code.',
        });
      }
    } catch (error: any) {
      console.error('Verification Error:', error);
      setError('root', {
        message:
          'An unexpected error occurred during verification. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Verify your email</Text>

      <View style={styles.form}>
        <CustomInput
          control={control}
          name="code"
          placeholder="123456"
          autoFocus
          keyboardType="number-pad"
          autoComplete="one-time-code"
        />

        {errors.root && (
          <Text style={styles.rootError}>{errors.root.message}</Text>
        )}
      </View>

      <CustomBtn
        onPress={handleSubmit(onVerify)}
        text={loading ? 'Verifying...' : 'Verify'}
        disabled={loading}
      />
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
  rootError: {
    color: 'crimson',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 4,
  },
});
