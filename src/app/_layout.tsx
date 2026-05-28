import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SessionProvider, useSession } from "@/ctx";
import { SplashScreenController } from "@/splash";

export default function RootLayout() {
  return (
    <SessionProvider>
      <SplashScreenController />
      <Root />
    </SessionProvider>
  );
}
function Root() {
  const { session } = useSession();

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
        }}
      >
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!session}>
          <Stack.Screen
            name="login"
            options={{ title: "login", headerShown: false }}
          />
        </Stack.Protected>
        <Stack.Screen name="signup" options={{ title: "Signup" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
