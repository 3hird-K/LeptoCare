import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

export default function ProtectedTabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs>
        <Tabs.Screen
            name="notification"
            options={{
            title: "Notifications",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="notifications-outline" size={size} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name="index"
            options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name="account"
            options={{
            title: "Account",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
            ),
            }}
        />
      
    </Tabs>
  );
}
