import React, { ComponentProps, forwardRef } from "react";
import { Animated, Platform, Text } from "react-native";
import { Dimensions } from "react-native";
import { FONT_SIZE_SCALING_FACTOR } from "@/constants";

const { fontScale } = Dimensions.get("window");

interface AppTextProps extends ComponentProps<typeof Text> {
    customStyles?: string;
}

const AppText = forwardRef<Text, AppTextProps>((props, ref) => {
    const { customStyles, ...otherProps } = props;

    const getFontSize = (styles: string): number => {
        const sizeMap: { [key: string]: number } = {
            "text-xs": 12,
            "text-sm": 14,
            "text-base": 16,
            "text-lg": 18,
            "text-xl": 20,
            "text-2xl": 24,
            "text-3xl": 30,
            "text-4xl": 36,
            "text-5xl": 48,
            "text-6xl": 60,
            "text-7xl": 72,
            "text-8xl": 96,
            "text-9xl": 128,
        };

        for (const [className, size] of Object.entries(sizeMap)) {
            if (styles.includes(className)) {
                return size;
            }
        }

        // Check for arbitrary text size class
        const arbitrarySizeMatch = styles.match(/text-\[(\d+)px\]/);
        if (arbitrarySizeMatch) {
            return parseInt(arbitrarySizeMatch[1], 10);
        }

        // Default size if no matching class is found
        return 16;
    };

    // const scaledFontSize = moderateScale(getFontSize(customStyles || '') * 0.882);

    // const updatedStyles = customStyles ? customStyles.replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|\[\d+px\])/g, '') : '';

    return (
        <Animated.Text
            ref={ref}
            className={`font-rubik text-green-dark dark:text-green-light text-base leading-relaxed ${
                customStyles ? customStyles : ""
            }`}
            {...(Platform.OS === "android" &&
                fontScale >= FONT_SIZE_SCALING_FACTOR && {
                    style: {
                        fontSize:
                            getFontSize(customStyles || "") *
                            FONT_SIZE_SCALING_FACTOR,
                    },
                })}
            {...otherProps}
        >
            {props.children}
        </Animated.Text>
    );
});

export default AppText;
