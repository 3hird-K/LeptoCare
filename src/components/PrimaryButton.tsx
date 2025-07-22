import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
};

export default function PrimaryButton({ label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#34C9B6',
    paddingVertical: 14,
    marginHorizontal: 20,
    marginVertical: 24,
    borderRadius: 50,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
