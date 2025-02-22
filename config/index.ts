import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppConfig = {
    AI_API_KEY: process.env.EXPO_PUBLIC_AI_API_KEY as string,
    PULSE_API: process.env.EXPO_PUBLIC_PULSE_API as string,
    GOOGLE_DIRECTIONS_API_KEY: process.env
        .EXPO_PUBLIC_GOOGLE_DIRECTIONS_API_KEY as string,
    OTP_RESEND_DELAY: Number(
        process.env.EXPO_PUBLIC_OTP_RESEND_DELAY as string
    ),
    OTP_LENGTH: Number(process.env.EXPO_PUBLIC_OTP_LENGTH as string),
    EXPO_PUBLIC_PRIVACY_POLICY_LINK: process.env
        .EXPO_PUBLIC_PRIVACY_POLICY_LINK as string,
    EXPO_PUBLIC_TERMS_OF_SERVICE_LINK: process.env
        .EXPO_PUBLIC_TERMS_OF_SERVICE_LINK as string,
};

export class AppLocalStorage {
    static async get(key: string) {
        try {
            const item = await AsyncStorage.getItem(key);
            return item ? JSON.parse(item) : null; // Parse item if it's a stringified JSON object (Doesn't hurt if it's not a JSON object)
        } catch (error) {
            console.error("Unable to get item from AsyncStorage: ", error);
            return null;
        }
    }

    static async set(key: string, value: unknown) {
        try {
            return await AsyncStorage.setItem(key, JSON.stringify(value)); // Stringify value if it's an object (Doesn't hurt if it's not)
        } catch (error) {
            console.error("Unable to add item to AsyncStorage: ", error);
            return null;
        }
    }

    static async delete(key: string) {
        try {
            return await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error("Unable to delete item from AsyncStorage: ", error);
            return null;
        }
    }

    static async clear() {
        try {
            return await AsyncStorage.clear();
        } catch (error) {
            console.error("Unable to clear AsyncStorage: ", error);
            return null;
        }
    }

    static async getAllKeys() {
        try {
            return await AsyncStorage.getAllKeys();
        } catch (error) {
            console.error("Unable to get all keys from AsyncStorage: ", error);
            return null;
        }
    }

    static async getAllItems() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const items = await AsyncStorage.multiGet(keys);
            return items.reduce(
                (
                    accumulator: Record<string, string | number | symbol>,
                    [key, value]
                ) => {
                    accumulator[key] = JSON.parse(value as string);
                    return accumulator;
                },
                {}
            );
        } catch (error) {
            console.error("Unable to get all items from AsyncStorage: ", error);
            return null;
        }
    }
}

export class AppSecureStore {
    static async get(key: string) {
        try {
            const item = await SecureStore.getItemAsync(key);
            return item ? JSON.parse(item) : null; // Parse item if it's a stringified JSON object (Doesn't hurt if it's not a JSON object)
        } catch (error) {
            console.log("Unable to get item from Secure Store: ", error);
            return null;
        }
    }

    static async set(key: string, value: unknown) {
        try {
            console.log("KEY: ", key);
            console.log("VALUE: ", value, typeof value);
            return await SecureStore.setItemAsync(key, JSON.stringify(value)); // Stringify value if it's an object (Doesn't hurt if it's not)
        } catch (error) {
            console.log("Unable to add item to Secure Store: ", error);
            return null;
        }
    }

    static async delete(key: string) {
        try {
            return await SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.log("Unable to delete item from Secure Store: ", error);
            return null;
        }
    }
}

export default AppConfig;
