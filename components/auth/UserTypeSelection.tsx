import React from "react";
import { View, Modal, Dimensions, type ScaledSize } from "react-native";
import Carousel, {
    type ICarouselInstance,
} from "react-native-reanimated-carousel";

import AppText from "@/components/global/AppText";
import AppButton from "@/components/global/AppButton";
import { UserRole } from "@/types";

interface UserTypeSelectionProps {
    isVisible: boolean;
    setSelectedUserType: React.Dispatch<React.SetStateAction<UserRole | null>>;
}

const UserTypeSelectionModal = ({
    isVisible,
    setSelectedUserType,
}: UserTypeSelectionProps) => {
    const ref = React.useRef<ICarouselInstance>(null);

    const userTypes = Object.values(UserRole);
    const window: ScaledSize = Dimensions.get("window");
    const PAGE_WIDTH = window.width;

    const baseOptions = {
        vertical: false,
        width: PAGE_WIDTH * 0.85,
        height: PAGE_WIDTH / 1.5,
    } as const;

    return (
        <Modal animationType="slide" transparent={true} visible={isVisible}>
            <View className="absolute bottom-0 bg-white/80 dark:bg-black/90 h-[25%] w-[100%] rounded-tr-[40px] rounded-tl-[40px]">
                <View className="mt-10 mb-6">
                    <AppText customStyles="font-rubik text-center text-3xl mb-2">
                        Let's get to know you better
                    </AppText>
                    <AppText customStyles="tex-lg text-center text-green-pale">
                        Which of the following best describes you?
                    </AppText>
                </View>


                {/* TODO: USE FLATLIST INSTEAD */}
                <Carousel
                    {...baseOptions}
                    loop={true}
                    ref={ref}
                    style={{ width: "100%" }}
                    autoPlay={true}
                    autoPlayInterval={5000}
                    data={userTypes}
                    pagingEnabled={true}
                    onSnapToItem={(index) =>
                        console.log("current index:", index)
                    }
                    renderItem={({ index }) => (
                        <AppButton
                            onPress={() =>
                                setSelectedUserType(userTypes[index])
                            }
                            buttonText={userTypes[index]}
                            className="ml-[15%]"
                            key={index}
                        />
                    )}
                />
            </View>
        </Modal>
    );
};

export default UserTypeSelectionModal;
