import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';

type Props = {
  title: string;
  subtitle: string;
  label: string;
  icon: ImageSourcePropType;
  theme: 'blue' | 'red';
  reviewed?: boolean;
};

export default function Card({ title, subtitle, label, icon, theme }: Props) {
  const isAwareness = theme === 'blue';

  return (
    <View style={[styles.card, { backgroundColor: isAwareness ? '#007ff7ff' : '#df0000ff' }]}>
      <Text
        style={[
          styles.tag,
          {
            backgroundColor: isAwareness ? '#b5dfcaff' : '#F9DADA',
            color: isAwareness ? '#1C7860' : '#D43C3C',
          },
        ]}
      >
        Reading guide
      </Text>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <Image source={icon} style={styles.icon} resizeMode="contain" />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 20,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    // Elevation for Android
    elevation: 5,
  },
  tag: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  icon: {
    width: 60,
    height: 60,
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  button: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '500',
  },
});
