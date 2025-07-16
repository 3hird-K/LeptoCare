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
import { Link, router } from 'expo-router';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';

// ✅ Schema with first name, last name, username, and confirm password
const signUpSchema = z
  .object({
    name: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z
      .string({ message: 'Email is required' })
      .email('Invalid email'),
    password: z
      .string({ message: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string({ message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type SignUpFields = z.infer<typeof signUpSchema>;

const mapClerkErrorToFormField = (error: any) => {
  switch (error.meta?.paramName) {
    case 'email_address':
      return 'email';
    case 'password':
      return 'password';
    case 'username':
      return 'username';
    default:
      return 'root';
  }
};

export default function SignUpScreen() {
  const { signUp, isLoaded } = useSignUp();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
  });

  const onSignUp = async (data: SignUpFields) => {
    if (!isLoaded || loading) return;
    setLoading(true);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.name,
        lastName: data.lastName,
        username: data.username,
      });

      await signUp.prepareVerification({ strategy: 'email_code' });

      router.push('/verify');
    } catch (err) {
      console.error('Sign Up Error:', JSON.stringify(err, null, 2));

      if (isClerkAPIResponseError(err)) {
        err.errors.forEach((error) => {
          const field = mapClerkErrorToFormField(error);
          setError(field as any, { message: error.message });
        });
      } else {
        setError('root', {
          message:
            'An unexpected error occurred. Please check your internet connection and try again.',
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
      <Text style={styles.title}>Create an account</Text>

      <View style={styles.form}>
        {/* <CustomInput
          control={control}
          name="name"
          placeholder="First Name"
          autoCapitalize="words"
        />
        <CustomInput
          control={control}
          name="lastName"
          placeholder="Last Name"
          autoCapitalize="words"
        /> */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <CustomInput
              control={control}
              name="name"
              placeholder="First Name"
              autoCapitalize="words"
            />
          </View>
          <View style={styles.halfInput}>
            <CustomInput
              control={control}
              name="lastName"
              placeholder="Last Name"
              autoCapitalize="words"
            />
          </View>
        </View>
        <CustomInput
          control={control}
          name="username"
          placeholder="Username"
          autoCapitalize="none"
        />
        <CustomInput
          control={control}
          name="email"
          placeholder="Email"
          keyboardType="email-address"
          autoComplete="email"
        />
        <CustomInput
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry
        />
        <CustomInput
          control={control}
          name="confirmPassword"
          placeholder="Confirm Password"
          secureTextEntry
        />

        {errors.root && (
          <Text style={styles.rootError}>{errors.root.message}</Text>
        )}
      </View>

      <CustomBtn
        onPress={handleSubmit(onSignUp)}
        text={loading ? 'Registering...' : 'Register Account'}
        disabled={loading}
      />

      <Link href="/sign-in" style={styles.link}>
        Already have an account? Sign in
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
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  link: {
    color: '#4353Fd',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  rootError: {
    color: 'crimson',
    fontSize: 14,
    marginTop: 4,
  },
});
