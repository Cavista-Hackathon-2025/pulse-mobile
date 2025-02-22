import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';


export const handleRedirect = async (
    event: Linking.EventType,
    callbackFn: (data: Linking.ParsedURL) => Promise<void>
) => {
    console.log("Event: ", event);
    if (Constants?.platform?.ios) {
        console.log("dismissing on ios");
        WebBrowser.dismissBrowser();
    }

    const data: Linking.ParsedURL = Linking.parse(event.url);
    console.log("Data: ", data);

    await callbackFn(data);
};

export const openBrowserAsync = async (
    url: string,
    callbackFn: (data: Linking.ParsedURL) => Promise<void>
) => {
    try {
        const eventSubscription = Linking.addEventListener(
            "url",
            async (event) => handleRedirect(event, callbackFn)
        );
        const result = await WebBrowser.openBrowserAsync(url);

        if (Constants?.platform?.ios) {
            eventSubscription.remove();
        }

        console.log("Result: ", result);
    } catch (error) {
        console.log("Error: ", error);
    }
};
