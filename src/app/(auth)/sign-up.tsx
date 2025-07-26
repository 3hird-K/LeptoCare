import {
  ActivityIndicator,
  Animated,
  ImageBackground,
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
import { useRef, useState } from 'react';
import CustomInputPassword from '@/components/CustomInputPassword';
import ScreenWrapper from '@/components/ScreenWrapper';

const signUpSchema = z
  .object({
    name: z.string({ message: 'First name is required' }).min(1, 'First name is required'),
    lastName: z.string({ message: 'Last name is required' }).min(1, 'Last name is required'),
    username: z.string({ message: 'Username is required' }).min(3, 'Username must be at least 3 characters'),
    email: z.string({ message: 'Email is required' }).email('Invalid email'),
    password: z.string({ message: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
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
  const inputAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
  });


  console.log(errors)


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
      console.log('SignUp object after create:', signUp);

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });


      router.push('/verify');
    } catch (err) {
      // console.error('Sign Up Error:', JSON.stringify(err, null, 2));

      if (isClerkAPIResponseError(err)) {
        err.errors.forEach((error) => {
          const field = mapClerkErrorToFormField(error);
          setError(field as any, { message: error.message });
        });
      } else {
        setError('root', {
          message: 'An unexpected error occurred. Please check your internet connection and try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
        <ImageBackground
        source={require('@assets/lepto_logo.png')}
        style={styles.bgImage}
        resizeMode="contain"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoAnim,
                transform: [
                  {
                    scale: logoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Animated.Image
              source={require('@assets/lepto2.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Text style={styles.title}>Nice to see you!</Text>
          <Text style={[styles.subtitle, {color:"#2b2b2bff"}]}>Create your account</Text>

          <View style={styles.form}>
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
            <CustomInputPassword
              control={control}
              name="password"
              placeholder="Password"
              secureTextEntry
            />
            <CustomInputPassword
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
            text={'Register Account'}
            disabled={loading}
            style={{ paddingTop: 20 }}
          />

          <Text style={styles.txtLink}>
            Already have an account? &nbsp;
            <Link href="/sign-in" style={styles.link}>
              Sign in
            </Link>
          </Text>

          {loading && (
            <View style={styles.loadingOverlay}>
              <Animated.View
                style={[
                  styles.loadingContainer,
                  {
                    transform: [
                      {
                        scale: inputAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Creating Account...</Text>
              </Animated.View>
            </View>
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '45%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.65)', // optional overlay to enhance readability
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 5,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
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
  txtLink: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  link: {
    color: '#4353Fd',
    fontSize: 16,
  },
  rootError: {
    color: 'crimson',
    fontSize: 14,
    marginTop: 4,
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
