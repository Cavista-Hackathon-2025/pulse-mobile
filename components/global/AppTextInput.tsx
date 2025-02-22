import {
    NativeSyntheticEvent,
    TextInput,
    TextInputFocusEventData,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import React, {
    ComponentProps,
    ReactElement,
    forwardRef,
    useState,
} from "react";
import { useColorScheme } from "nativewind";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import CloseIcon from "./CloseIcon";

interface AppTextInputProps extends ComponentProps<typeof TextInput> {
    afterIcon?: ReactElement;
    asSelect?: boolean;
    beforeIcon?: ReactElement;
    isForSearch?: boolean;
    clearTextInput?: () => void;
    clearTextIconColor?: string;
    clearTextIconCustomStyles?: string;
    customStyles?: string;
    isPrimary?: boolean;
    onPress?: () => void;
}

const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
    (
        {
            afterIcon,
            beforeIcon,
            clearTextIconColor,
            clearTextIconCustomStyles,
            editable,
            onFocus,
            onBlur,
            isForSearch = false,
            isPrimary = true,
            ...otherProps
        },
        ref
    ) => {
        const { colorScheme } = useColorScheme();
        const [isFocused, setIsFocused] = useState(false);

        const handleFocus = (
            e: NativeSyntheticEvent<TextInputFocusEventData>
        ) => {
            setIsFocused(true);
            onFocus && onFocus(e);
        };

        const handleBlur = (
            e: NativeSyntheticEvent<TextInputFocusEventData>
        ) => {
            setIsFocused(false);
            onBlur && onBlur(e);
        };

        if (isPrimary) {
            return (
                <View className="relative">
                    {otherProps.asSelect && otherProps.onPress && (
                        <TouchableOpacity
                            style={{
                                zIndex: 100,
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                opacity: 100,
                            }}
                            onPress={otherProps.onPress}
                        />
                    )}
                    <TextInput
                        ref={ref}
                        className={`h-[50px] p-3 font-rubik dark:text-green-light bg-gray-400/5 dark:bg-gray-400/40 border-2 border-b-[3px] border-gray-400/5 border-b-gray-500/30 dark:border-b-gray-400/40 border-r-gray-400/30 dark:border-r-gray/400/40 rounded-lg ${
                            isFocused
                                ? "bg-green-light/40 border-b-[4px] border-r-[3px] border-green-light/50 dark:border-green-light/10 dark:border-b-green-light/20 dark:border-r-green-light/20"
                                : ""
                        } ${
                            otherProps.customStyles
                                ? otherProps.customStyles
                                : ""
                        }`}
                        cursorColor={
                            colorScheme === "light"
                                ? Colors.light.primary
                                : Colors.dark.primary
                        }
                        selectionColor={
                            colorScheme === "light"
                                ? Colors.light.primary
                                : Colors.dark.primary
                        }
                        placeholderTextColor={
                            colorScheme === "light"
                                ? Colors.light.secondary
                                : Colors.dark.secondary
                        }
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        editable={
                            typeof editable !== "undefined"
                                ? editable
                                : !otherProps.asSelect
                        }
                        {...otherProps}
                    />
                    {otherProps.asSelect && (
                        <View className="absolute top-3 right-4">
                            <Ionicons
                                name="chevron-down-outline"
                                size={24}
                                className=""
                                color={
                                    colorScheme === "light"
                                        ? Colors.light.secondary
                                        : Colors.dark.secondary
                                }
                            />
                        </View>
                    )}
                    {otherProps?.clearTextInput && (
                        <CloseIcon
                            color={
                                clearTextIconColor || isFocused
                                    ? Colors.light.dark
                                    : Colors.light.secondary
                            }
                            customStyles={`top-[10px] right-1 ${
                                clearTextIconCustomStyles
                                    ? clearTextIconCustomStyles
                                    : ""
                            }`}
                            onPress={() =>
                                otherProps.clearTextInput &&
                                otherProps.clearTextInput()
                            }
                            size={22}
                        />
                    )}
                </View>
            );
        } else {
            return (
                <View className="relative">
                    {beforeIcon && beforeIcon}
                    {isForSearch && (
                        <View className="absolute top-4 left-2">
                            <Ionicons
                                name="search"
                                size={20}
                                color={
                                    colorScheme === "light"
                                        ? Colors.light.secondary
                                        : Colors.dark.secondary
                                }
                            />
                        </View>
                    )}
                    <TextInput
                        ref={ref}
                        className={`h-[50px] pl-3 ${
                            isForSearch || beforeIcon ? "pl-10" : "pl-3"
                        } ${
                            otherProps.clearTextInput || afterIcon
                                ? "pr-9"
                                : "pr-3"
                        } font-rubik border border-gray-400 rounded-lg ${
                            isFocused ? "border-gray-500" : ""
                        }  ${
                            otherProps.customStyles
                                ? otherProps.customStyles
                                : ""
                        }`}
                        cursorColor={
                            colorScheme === "light"
                                ? Colors.light.primary
                                : Colors.dark.primary
                        }
                        selectionColor={
                            colorScheme === "light"
                                ? Colors.light.primary
                                : Colors.dark.primary
                        }
                        placeholderTextColor={
                            colorScheme === "light"
                                ? Colors.light.secondary
                                : Colors.dark.secondary
                        }
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        {...otherProps}
                    />
                    {otherProps?.clearTextInput && (
                        <CloseIcon
                            color={
                                clearTextIconColor || isFocused
                                    ? Colors.light.dark
                                    : Colors.light.secondary
                            }
                            customStyles={`top-[10px] right-1 ${
                                clearTextIconCustomStyles
                                    ? clearTextIconCustomStyles
                                    : ""
                            }`}
                            onPress={() =>
                                otherProps.clearTextInput &&
                                otherProps.clearTextInput()
                            }
                            size={22}
                        />
                    )}
                    {afterIcon && afterIcon}
                </View>
            );
        }
    }
);

export default AppTextInput;
