import { Link } from 'expo-router';
import { View, Text, StyleSheet, Button } from 'react-native'
import { useAuth } from '@/providers/AuthProvider';
import CustomBtn from '@/components/CustomBtn';

export default function WelcomeScreen() {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to LeptoCare!</Text>

      <Text>{isAuthenticated? "Authenticated" : "Unauthenticated"}</Text>
      <CustomBtn text="Sign-out" onPress={signOut} />


      <Link href='/sign-in'>Sign-In</Link>
      <Link href='/(protected)'>Goto Protected Screens</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});