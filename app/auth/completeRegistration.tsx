import { View } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import OTPVerification from "@/components/auth/OTPVerification";
import UserRegistration from "@/components/auth/UserRegistration";
import UserTypeSelection from "@/components/auth/UserTypeSelection";
import { UserRole } from "@/types";
import RootView from "@/components/global/RootView";

const completeRegistration = () => {
    const { email, userProfileStringified } = useLocalSearchParams();

    const [OTPIsVerified, setOTPIsVerified] = useState(
        !!userProfileStringified
    ); //TODO: set to false
    const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(
        null
    ); // TODO: set to null
    const [userProfile, setUserProfile] = useState<Record<
        string,
        string
    > | null>(
        userProfileStringified
            ? JSON.parse(userProfileStringified as string)
            : null
    );

    return (
        <RootView>
            {selectedUserRole ? (
                <UserRegistration
                    
                />
            ) : OTPIsVerified ? (
                <UserTypeSelection  />
            ) : (
                <OTPVerification
                    
                />
            )}
        </RootView>
    );
};

export default completeRegistration;
