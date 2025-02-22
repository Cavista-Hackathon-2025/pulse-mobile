import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface CloseIconProps {
    color?: string;
    customStyles: string;
    onPress: () => void;
    size?: number;
}

const CloseIcon = ({
    color,
    customStyles,
    onPress,
    size = 25,
}: CloseIconProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`z-40 absolute p-1 rounded-full ${customStyles}`}
        >
            <Ionicons
                name="close-outline"
                size={size}
                color={color || Colors.light.dark}
            />
        </TouchableOpacity>
    );
};

export default CloseIcon;
