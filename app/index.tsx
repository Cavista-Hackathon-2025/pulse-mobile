import { Redirect, useLocalSearchParams } from "expo-router";
import { User, UserRole } from "@/types";

import "@/styles.css";

const Index = () => {
    const { userStringified } = useLocalSearchParams();
    const user = JSON.parse(userStringified as string) as User;
    console.log("got user: ", typeof user, user);
    const userRole = user?.baseProfile?.role as UserRole;

    if (user) {
        console.log("to home...");
        return (
            <Redirect
                href={`/${userRole}Home?userStringified=${userStringified}`}
            />
        );
    } else {
        console.log("to login...");
        return <Redirect href="/auth/login" />;
    }
};
export default Index;
