import { Tabs } from "expo-router";

const Layout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="patientHome"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
        </Tabs>
    );
};

export default Layout;
