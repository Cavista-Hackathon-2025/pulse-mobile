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
    );
    const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(
        null
    );
    const [userProfile, setUserProfile] = useState<Record<
        string,
        string
    > | null>(
        userProfileStringified
            ? JSON.parse(userProfileStringified as string)
            : null
    );

    return (
        <RootView customStyles={`flex-1 dark:bg-black/90`}>
            {selectedUserRole ? (
                <UserRegistration
                    userRole={selectedUserRole}
                    hideRegistrationModal={() => setSelectedUserRole(null)}
                    newUserProfile={userProfile}
                />
            ) : OTPIsVerified ? (
                <UserTypeSelection setSelectedUserRole={setSelectedUserRole} />
            ) : (
                <OTPVerification
                    email={(userProfile?.email || email) as string}
                    OTPIsVerified={OTPIsVerified}
                    setOTPIsVerified={setOTPIsVerified}
                    setUserProfile={setUserProfile}
                />
            )}
        </RootView>
    );
};

export default completeRegistration;
