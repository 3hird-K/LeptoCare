import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import '../../i18n/config';
import AnimatedTabBar from "@/components/AnimatedTabBar";

export default function ProtectedTabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs screenOptions={{headerShown: false}}  tabBar={(props) => <AnimatedTabBar {...props} />}>
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notifications",
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account Settings",
        }}
      />
    </Tabs>
  );
}
