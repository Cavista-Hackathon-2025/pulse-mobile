import React, { ComponentProps, ReactElement, forwardRef } from "react";
import { ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import AppText from "./AppText";
import { useColorScheme } from "nativewind";
import Colors from "@/constants/Colors";
import { Position } from "@/types";

interface AppButtonProps extends ComponentProps<typeof TouchableOpacity> {
    bgColor?: string;
    borderColor?: string;
    borderWidth?: string;
    buttonText: string;
    buttonTextCustomStyles?: string;
    disabled?: boolean;
    customStyles?: string;
    icon?: ReactElement;
    iconPosition?: Position.LEFT | Position.RIGHT;
    isLoading?: boolean;
    isPrimary?: boolean;
    marginBottom?: string;
    marginTop?: string;
    onPress: () => void;
    useDefault?: boolean;
    width?: string;
}

const AppButton = forwardRef<TouchableOpacity, AppButtonProps>((props, ref) => {
    const {
        buttonText,
        buttonTextCustomStyles,
        customStyles,
        icon,
        iconPosition = Position.LEFT,
        isLoading,
        isPrimary = true,
        ...nativeProps
    } = props;
    const { colorScheme } = useColorScheme();

    return (
        <TouchableOpacity
            ref={ref}
            className={`flex-row h-[50px] items-center justify-center 
        bg-green-dark border rounded-md ${
            isPrimary
                ? "border-green-dark"
                : "bg-white dark:bg-green-light border-green-pale dark:border-green-light"
        } ${
                nativeProps.disabled
                    ? "opacity-30 dark:opacity-50 border-green-pale/20"
                    : ""
            }
 ${customStyles ? customStyles : ""} ${
                Platform.OS === "android" ? "px-2" : ""
            }`}
            {...nativeProps}
        >
            {iconPosition === Position.LEFT && (
                <>{icon && !isLoading ? icon : null}</>
            )}
            <AppText
                customStyles={`${
                    icon && iconPosition === Position.LEFT
                        ? "ml-2"
                        : (icon && iconPosition === Position.RIGHT) || isLoading
                        ? "mr-2"
                        : ""
                } ${
                    isPrimary
                        ? "text-white dark:text-green-light"
                        : "text-green-dark"
                } ${buttonTextCustomStyles ? buttonTextCustomStyles : ""}`}
                adjustsFontSizeToFit
                numberOfLines={1}
            >
                {buttonText}
            </AppText>
            {isLoading && (
                <ActivityIndicator
                    color={
                        isPrimary
                            ? colorScheme === "light"
                                ? "white"
                                : Colors.dark.primary
                            : colorScheme === "light"
                            ? Colors.light.primary
                            : Colors.dark.primary
                    }
                    size="small"
                />
            )}
            {iconPosition === Position.RIGHT && (
                <>{icon && !isLoading ? icon : null}</>
            )}
        </TouchableOpacity>
    );
});

export default AppButton;
