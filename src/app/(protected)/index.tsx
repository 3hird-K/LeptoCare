import CustomBtn from "@/components/CustomBtn";
import { useAuth } from "@clerk/clerk-expo";
import { View, Text, StyleSheet, Button } from "react-native";


export default function HomeScreen() {

  const { signOut } = useAuth();


  return (
    <View style={styles.container}>
        <Text style={styles.title}>HomeScreen</Text>
        <Text style={styles.paragraph}>Users' Welcome to LeptoCares!</Text>
        <CustomBtn text="Sign-out" onPress={() => signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  paragraph: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
