// app/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';

const SplashScreen = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate logo fade-in and scale
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after delay
    const timeout = setTimeout(() => {
      router.replace('/sign-in'); // Adjust this to your actual screen
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('@assets/lepto_logo.png')} 
        style={[
          styles.logo,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
        resizeMode="contain"
      />
      {/* <Animated.Text style={[styles.title, { opacity }]}>
        Welcome to LeptoCare
      </Animated.Text> */}
    </View>
  );
};

export default SplashScreen;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c3c3c4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.8, // Adjust logo size as needed
    height: width * 1.2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    // marginTop: 5,
    opacity: 0, // Initial opacity for animation
  },
});
