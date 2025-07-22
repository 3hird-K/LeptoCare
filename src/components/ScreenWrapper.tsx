import { SafeAreaView, StyleSheet } from 'react-native';

export default function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
});
