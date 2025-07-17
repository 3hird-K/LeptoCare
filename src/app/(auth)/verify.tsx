import React, { useRef, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  ImageBackground,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import CustomBtn from '@/components/CustomBtn';

const verifySchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

type VerifyFields = z.infer<typeof verifySchema>;

export default function VerifyEmailScreen() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const inputAnim = useRef(new Animated.Value(0)).current;
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const { setError } = useForm<VerifyFields>({
    resolver: zodResolver(verifySchema),
  });

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const updatedDigits = [...codeDigits];
      updatedDigits[index] = value;
      setCodeDigits(updatedDigits);

      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }

      if (index === 5 && value) {
        onVerify(updatedDigits.join(''));
      }
    }
  };

  const onVerify = async (code: string) => {
    if (!isLoaded || loading) return;
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/');
      } else {
        setError('code', {
          message: 'Verification failed. Please double-check your code.',
        });
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        err.errors.forEach((error) => {
          setError('code', { message: error.message });
        });
      } else {
        setError('code', {
          message: 'An unexpected error occurred. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('@assets/verify.png')} 
      style={styles.bgImage}
      resizeMode="contain"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>
          Please enter the verification code{' '}
          <Text style={styles.bold}>we sent to your email address</Text> to
          complete the verification process.
        </Text>

        <View style={styles.otpContainer}>
          {codeDigits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputsRef.current[index] = ref;
              }}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <CustomBtn
          onPress={() => onVerify(codeDigits.join(''))}
          text="Verify"
          disabled={loading}
        />

        {loading && (
          <View style={styles.loadingOverlay}>
            <Animated.View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>Verifying...</Text>
            </Animated.View>
          </View>
        )}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    marginTop: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
    padding: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.01)', // Optional white overlay for readability
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 48,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4353Fd',
    fontWeight: '600',
  },
});
