import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';

type Props = {
  onPress: () => void;
};

export default function GithubIconButton({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image
        source={require('@assets/facebook.png')}
        style={styles.icon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: '#4353Fd', 
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  icon: {
    width: 28,
    height: 28,
  },
});
