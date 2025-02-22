import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    TouchableOpacity,
} from "react-native";
import React, { ComponentProps, ReactNode, useContext, useEffect } from "react";
import LottieView from "lottie-react-native";
import { AppStateContext } from "@/contexts/AppStateContext";
import primaryLoader from "@/assets/lottie/primaryLoader.json";
import { AppToastContext } from "@/contexts/AppToastContext";
import AppToast from "./AppToast";
import AppText from "./AppText";
import useUser from "@/hooks/useUser";
import { User } from "@/types";
import { useColorScheme } from "nativewind";

interface RootViewProps extends ComponentProps<typeof View> {
    customStyles?: string;
    statusBarColor?: string;
    wrapperViewCustomStyles?: string;
}

const RootView = (props: RootViewProps) => {
    const { isLoading, loadingText, statusBarColor } =
        useContext(AppStateContext);
    const { user } = useUser();
    const {
        toastIsShowing,
        toastMessage,
        toastType,
        toastOptions,
    } = useContext(AppToastContext);
    const { colorScheme } = useColorScheme();

    const { customStyles, wrapperViewCustomStyles } = props;

    return (
        <SafeAreaView
            className={`relative flex-1 ${
                Platform.OS === "android" ? "pt-6" : ""
            } ${wrapperViewCustomStyles ? wrapperViewCustomStyles : ""}`}
            style={{ backgroundColor: props.statusBarColor || statusBarColor }}
        >
            {isLoading && (
                <View className="absolute flex-1 bg-gray-300/90 top-0 left-0 right-0  bottom-0 justify-center items-center z-50">
                    <LottieView
                        source={primaryLoader}
                        speed={2}
                        style={{ width: 150, height: 150 }}
                        autoPlay
                        loop
                    />
                    {loadingText && (
                        <AppText customStyles="mt-3 text-lg text-gray-300 font-rubikMedium text-center">
                            {loadingText}
                        </AppText>
                    )}
                </View>
            )}

            {toastIsShowing && toastMessage && toastType && (
                <AppToast
                    toastMessage={toastMessage}
                    toastOptions={toastOptions}
                    toastType={toastType}
                />
            )}

            <View
                className={`flex-1 bg-white ${
                    customStyles ? customStyles : ""
                } ${toastIsShowing ? "" : ""}`}
            >
                {props.children}
            </View>
        </SafeAreaView>
    );
};

export default RootView;
