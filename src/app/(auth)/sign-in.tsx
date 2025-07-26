import React, { useState, useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  ActivityIndicator,
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
import { Feather } from '@expo/vector-icons';
import CustomInputPassword from '@/components/CustomInputPassword';
import SignInWithGoogle from '@/components/SignInWithGoogle';
import SignInWithGithub from '@/components/SignInWithGithub';
import SignInWithFacebook from '@/components/SignInWithFacebook';
import ScreenWrapper from '@/components/ScreenWrapper';





const signInSchema = z.object({
  identifier: z.string({ message: 'Email or Username is required' }).min(1, 'Email or Username is required'),
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
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
  });



  const inputAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(inputAnim, {
        toValue: 1,
        duration: 600,
        delay: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(logoAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onSignIn = async (data: SignInFields) => {
    if (!isLoaded || loading) return;

    setLoading(true);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

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
          setError(field, { message: error.message });
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
    <ScreenWrapper>
          <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <Animated.View
            style={[
              styles.form,
              {
                opacity: inputAnim,
                transform: [
                  {
                    translateY: inputAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [40, 0],
                    }),
                  },
                ],
              },
            ]}
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
                    source={require('@assets/lepto_.png')}
                    style={styles.logo}
                    resizeMode="cover"
                  />
              </Animated.View>

              <Animated.View style={{ gap:12, marginTop: 0, paddingTop: 0 }}>

                    <Text style={styles.title}>Hello Again!</Text>
                    <Text style={styles.subtitle}>Log into your account</Text>

                  
                    <CustomInput
                      control={control}
                      name="identifier"
                      placeholder="Email or Username"
                      autoFocus
                      autoCapitalize="none"
                    />
                    <CustomInputPassword
                      control={control}
                      name="password"
                      placeholder="Password"
                      secureTextEntry={!showPassword}
                      rightElement={
                        <Feather
                          name={showPassword ? 'eye' : 'eye-off'}
                          size={15}
                          color="#a1a1a1"
                          onPress={() => setShowPassword((prev) => !prev)}
                        />
                      }
                    />

                  
                    {errors.root && (
                      <Text style={styles.rootError}>{errors.root.message}</Text>
                    )}
                  
                  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <CustomBtn
                      onPress={handleSubmit(onSignIn)}
                      text={'Login'}
                      disabled={loading}
                    />

                  </Animated.View>

                    <Text style={styles.txtLink}>
                      Don’t have an account? &nbsp; 
                      <Link href="/sign-up" style={styles.link}>
                      Sign up
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
                          <ActivityIndicator size="large"  />
                          <Text style={styles.loadingText}>Logging in...</Text>
                        </Animated.View>
                      </View>
                    )}  

            </Animated.View>


          </Animated.View>


          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialContainer}>
            <SignInWithGoogle />
            <View style={{ width: 12 }} />
            <SignInWithGithub />
            <View style={{ width: 12 }} />
            <SignInWithFacebook />
          </View> 



        </KeyboardAvoidingView>
    </ScreenWrapper>
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
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 5,
    padding: 0,
    margin: 0,
    marginBottom: -80,
  },
  logo: {
    width: 300,
    height: 300,
    borderRadius: 20,
    padding: 0,
    margin: 0
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 0,
    paddingTop: 0,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#f8f8f8',
    // backgroundColor: '#9c9c9cff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
    // gap: 10,
  },
  txtLink: {
    // color: '#4353Fd',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
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
    textAlign: 'center',
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
  dividerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 16,
},

line: {
  flex: 1,
  height: 1,
  backgroundColor: '#ccc',
},

orText: {
  marginHorizontal: 10,
  color: '#555',
  fontWeight: '500',
},

socialContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 10,
},
});
