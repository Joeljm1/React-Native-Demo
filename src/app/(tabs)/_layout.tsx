import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Button } from "react-native";
import { useSession } from "@/ctx";

export default function TabLayout() {
  const { signOut } = useSession();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        headerRight: () => <Button onPress={signOut} title="Sign out" />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="expense"
        options={{
          headerShown: false,
          title: "Expense",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
