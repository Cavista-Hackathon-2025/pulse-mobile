import React from "react";
import { useLocalSearchParams } from "expo-router";
import RootView from "@/components/global/RootView";
import { User } from "@/types";
import useUser from "@/hooks/useUser";
import AppText from "@/components/global/AppText";

const PatientHome = () => {
    const { userStringified } = useLocalSearchParams();
    const user = userStringified
        ? (JSON.parse(userStringified as string) as User)
        : useUser().user;

    if (!user) {
        return null;
    }

    return (
        <RootView>
            <AppText>Patient Home</AppText>
        </RootView>
    );
};

export default PatientHome;
