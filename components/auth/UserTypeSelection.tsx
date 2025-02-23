import { View, useWindowDimensions, ViewToken, Platform } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import UserTypeCarouselItem from "@/components/auth/UserTypeCarouselItem";
import AppButton from "@/components/global/AppButton";
import { UserRole, UserType } from "@/types";
import AppText from "../global/AppText";

interface UserTypeSelectProps {
    setSelectedUserRole: React.Dispatch<React.SetStateAction<UserRole | null>>;
}

const UserTypeSelection = ({ setSelectedUserRole }: UserTypeSelectProps) => {
    const [activeUserTypeIndex, setActiveUserTypeIndex] = useState(0);
    const { width } = useWindowDimensions();
    const x = useSharedValue(0);
    const ITEM_WIDTH = Platform.OS === "android" ? 275 : 300;
    const ITEM_HEIGHT = 400;
    const MARGIN_HORIZONTAL = 40;
    const ITEM_FULL_WIDTH = ITEM_WIDTH + MARGIN_HORIZONTAL * 2;
    const SPACER = (width - ITEM_FULL_WIDTH) / 2;

    const userTypes: UserType[] = useMemo(
        () => [
            {
                id: 1,
                name: UserRole.PATIENT,
                image: require("@/assets/images/patient.png"),
                description: "",
                verbose: "A PATIENT",
            },
            {
                id: 2,
                name: UserRole.HOSPITAL,
                image: require("@/assets/images/hospital.png"),
                description: "",
                verbose: "AN HOSPITAL",
            },
            {
                id: 3,
                image: require("@/assets/images/medTransport.png"),
                description:
                    "",
                name: UserRole.MED_TRANSPORT,
                verbose: "A MEDICAL TRANSPORT PARTNER",
            },
        ],
        []
    );

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            x.value = event.contentOffset.x;
        },
    });

    const onViewableItemsChanged = ({
        viewableItems,
    }: {
        viewableItems: ViewToken[];
        changed: ViewToken[];
    }) => {
        viewableItems &&
            viewableItems.length > 0 &&
            setActiveUserTypeIndex(viewableItems[0].index as number);
    };

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };

    const viewabilityConfigCallbackPairs = useRef([
        { viewabilityConfig, onViewableItemsChanged },
    ]);

    return (
        <View className="flex-1 pt-20">
            <View className="mb-10">
                <AppText
                    customStyles="text-3xl text-center"
                    adjustsFontSizeToFit
                    numberOfLines={1}
                >
                    Choose the character that best
                </AppText>
                <AppText customStyles="text-3xl text-center">
                    reflects your true self
                </AppText>
            </View>
            <Animated.FlatList
                onScroll={onScroll}
                viewabilityConfigCallbackPairs={
                    viewabilityConfigCallbackPairs.current
                }
                ListHeaderComponent={<View />}
                ListHeaderComponentStyle={{ width: SPACER }}
                ListFooterComponent={<View />}
                ListFooterComponentStyle={{ width: SPACER }}
                data={userTypes}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id + item.name}
                renderItem={({ item, index }) => {
                    return (
                        <UserTypeCarouselItem
                            item={item}
                            index={index}
                            x={x}
                            width={ITEM_WIDTH}
                            height={ITEM_HEIGHT}
                            marginHorizontal={MARGIN_HORIZONTAL}
                            fullWidth={ITEM_FULL_WIDTH}
                        />
                    );
                }}
                horizontal
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={ITEM_FULL_WIDTH}
            />
            <View className="flex-1 justify-center">
                <AppButton
                    buttonText={`CONTINUE AS ${userTypes[activeUserTypeIndex].verbose}`}
                    className="h-max-min w-[90%] self-center"
                    onPress={() =>
                        setSelectedUserRole(userTypes[activeUserTypeIndex].name)
                    }
                />
            </View>
        </View>
    );
};

export default UserTypeSelection;
