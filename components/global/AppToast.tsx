import React, { useCallback, useEffect, useContext } from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withDelay,
    withTiming,
    withSpring,
    runOnJS,
} from "react-native-reanimated";
import Modal from "react-native-modal";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Platform } from "react-native";
import {
    AppToastContext,
    ToastOptions,
    ToastType,
} from "@/contexts/AppToastContext";
import { TOAST_DISPLAY_DURATION } from "@/constants";
import { FontAwesome5 } from "@expo/vector-icons";
import AppText from "./AppText";
import { useColorScheme } from "nativewind";
import Colors from "@/constants/Colors";
import { View } from "react-native";

interface AppToastProps {
    toastMessage: string;
    toastOptions: ToastOptions | undefined;
    toastType: ToastType;
}

const AppToast = ({ toastMessage, toastOptions, toastType }: AppToastProps) => {
    const toastTopAnimation = useSharedValue(-100);
    const context = useSharedValue(0);
    const { hideToast } = useContext(AppToastContext);
    const duration = toastOptions?.duration || TOAST_DISPLAY_DURATION;
    const { colorScheme } = useColorScheme();
    const TOP_VALUE = Platform.OS === "ios" ? 60 : 20;

    const toastTheme = {
        [ToastType.SUCCESS]: {
            border: "border-green-500",
            icon: (
                <FontAwesome5
                    name="smile-beam"
                    size={24}
                    color="rgb(34, 197, 94)"
                />
            ),
            typography: "text-green-500",
        },
        [ToastType.ERROR]: {
            border: "border-red-500",
            icon: (
                <FontAwesome5 name="frown" size={24} color="rgb(239, 68, 68)" />
            ),
            typography: "text-red-500",
        },
        [ToastType.WARNING]: {
            border: "border-orange-400",
            icon: (
                <FontAwesome5 name="meh" size={24} color="rgb(251, 146, 60)" />
            ),
            typography: "text-orange-400",
        },
        [ToastType.INFO]: {
            border: "border-white dark:border-green-dark",
            icon: (
                <FontAwesome5
                    name="smile-wink"
                    size={24}
                    color={`${
                        colorScheme === "light" ? "#fff" : Colors.light.primary
                    }`}
                />
            ),
            typography: "text-white dark:text-green-dark",
        },
    };

    const show = useCallback(() => {
        toastTopAnimation.value = withSequence(
            withTiming(TOP_VALUE),
            withDelay(
                duration,
                withTiming(-100, undefined, (finish) => {
                    if (finish) {
                        runOnJS(hideToast)();
                    }
                })
            )
        );
    }, [TOP_VALUE, toastTopAnimation]);

    useEffect(() => show(), []);

    const animatedTopStyles = useAnimatedStyle(() => {
        return {
            top: toastTopAnimation.value,
        };
    });

    const pan = Gesture.Pan()
        .onBegin(() => {
            context.value = toastTopAnimation.value;
        })
        .onUpdate((event) => {
            if (event.translationY < 100) {
                toastTopAnimation.value = withSpring(
                    context.value + event.translationY,
                    {
                        damping: 600,
                        stiffness: 100,
                    }
                );
            }
        })
        .onEnd((event) => {
            if (event.translationY < 0) {
                toastTopAnimation.value = withTiming(
                    -100,
                    undefined,
                    (finish) => {
                        if (finish) {
                            runOnJS(hideToast)();
                        }
                    }
                );
            } else if (event.translationY > 0) {
                toastTopAnimation.value = withSequence(
                    withTiming(TOP_VALUE),
                    withDelay(
                        duration,
                        withTiming(-100, undefined, (finish) => {
                            if (finish) {
                                runOnJS(hideToast)();
                            }
                        })
                    )
                );
            }
        });

    return (
        <>
            <Modal
                isVisible
                onBackdropPress={() => hideToast()}
                onBackButtonPress={() => hideToast()}
                backdropOpacity={0.8}
            >
                <GestureDetector gesture={pan}>
                    <Animated.View
                        className={`z-[99999999] absolute top-0 left-5 flex-row items-center justify-center space-x-4 w-[90%] p-3 mx-auto rounded-lg border ${toastTheme[toastType].border}`}
                        style={animatedTopStyles}
                    >
                        <View className="">{toastTheme[toastType].icon}</View>
                        <View className="flex-1">
                            <AppText
                                adjustsFontSizeToFit
                                customStyles={`${toastTheme[toastType].typography}`}
                                numberOfLines={2}
                            >
                                {toastMessage}
                            </AppText>
                        </View>
                    </Animated.View>
                </GestureDetector>
            </Modal>
        </>
    );
};

export default AppToast;
