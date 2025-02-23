import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "@expo-google-fonts/inter";
import {
    Rubik_400Regular,
    Rubik_600SemiBold,
    Rubik_500Medium,
} from "@expo-google-fonts/rubik";
import { RobotoMono_400Regular } from "@expo-google-fonts/roboto-mono";
import { AppStateProvider } from "@/contexts/AppStateContext";
import { AppToastProvider } from "@/contexts/AppToastContext";
import { User } from "@/types";
import useUser from "@/hooks/useUser";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        RobotoMono: RobotoMono_400Regular,
        Rubik: Rubik_400Regular,
        RubikSemiBold: Rubik_600SemiBold,
        RubikMedium: Rubik_500Medium,
    });

    const { user, isCheckingUser } = useUser();

    useEffect(() => {
        const checkAndHideSplash = async () => {
            try {
                if (loaded && !error) {
                    SplashScreen.hideAsync();
                }
            } catch (err) {
                console.error("Error checking user:", err);
            }
        };

        checkAndHideSplash();
    }, [loaded, error]);

    if (!loaded || isCheckingUser) {
        return null;
    }

    return (
        <GestureHandlerRootView>
            <SafeAreaProvider>
                <AppStateProvider>
                    <AppToastProvider>
                        <RootLayoutNav user={user} />
                    </AppToastProvider>
                </AppStateProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

interface RootLayoutNavProps {
    user: User | null;
}

function RootLayoutNav({ user }: RootLayoutNavProps) {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                initialParams={{ userStringified: JSON.stringify(user) }}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="(patient-tabs)"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="(hospital-tabs)"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="(med-transport-tabs)"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="auth/login"
                options={{
                    headerTitle: "",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="auth/completeRegistration"
                options={{
                    headerTitle: "",
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
