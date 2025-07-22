import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Lepto
        <Text style={styles.highlight}>Care</Text>
        <Text style={styles.subtitle}>Leptocare promotes awareness and prevention of leptospirosis through education, hygiene practices, and avoidance of contaminated water to reduce infection risks.</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  highlight: {
    textDecorationLine: 'underline',
    textDecorationColor: '#FFD700',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});
