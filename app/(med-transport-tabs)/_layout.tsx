import { Tabs } from "expo-router";

const Layout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="medTransportHome"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
        </Tabs>
    );
};

export default Layout;
