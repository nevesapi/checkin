import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={"default"} backgroundColor={"#111827"} />
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          headerStyle: {
            backgroundColor: "#111827",
          },
          headerTintColor: "#ffffff",
          headerShown: false,
        }}
      />
      {/*  <Stack screenOptions={{ headerShown: false }} /> deixar??? */}
    </SafeAreaProvider>
  );
}
