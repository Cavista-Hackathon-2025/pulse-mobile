import { useContext, useEffect, useState } from "react";
import { View, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";

import AppText from "@/components/global/AppText";

import { Image } from "expo-image";
import { Keyboard } from "react-native";
import AppTextInput from "@/components/global/AppTextInput";
import AppButton from "@/components/global/AppButton";
import { sendEmailOTP } from "@/utils";
import { openBrowserAsync } from "@/helpers";
import { AppStateContext } from "@/contexts/AppStateContext";
import RootView from "@/components/global/RootView";
import AppConfig from "@/config";
import useUser from "@/hooks/useUser";

const login = () => {
    const { user } = useUser();
    const router = useRouter();
    const [allButtonsDisabled, setAllButtonsDisabled] = useState(false);
    const { setIsLoading } = useContext(AppStateContext);

    useEffect(() => {
        if (user) {
            return router.replace(
                `/${
                    user?.baseProfile?.role
                }Home?userStringified=${JSON.stringify(user)}`
            );
        }
    }, []);

    const loginFormValidationSchema = Yup.object().shape({
        email: Yup.string()
            .required("Please enter your email address")
            .email("Invalid email address"),
    });

    return (
        <RootView>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View className="dark:bg-black/90 px-7 py-16 flex-1">
                    <View className="items-center justify-center mb-8">
                        {/* LOGO */}
                        <Image
                            source={require("@/assets/images/logo.png")}
                            className=""
                            style={{ width: 170, height: 170 }}
                        />
                        <AppText customStyles="font-rubikSemiBold text-3xl text-center">
                            Hello, Welcome to Pulse
                        </AppText>
                    </View>

                    <View className="mb-4">
                        {/* EMAIL FORM */}
                        <Formik
                            initialValues={{
                                email: "",
                            }}
                            validationSchema={loginFormValidationSchema}
                            onSubmit={async (
                                values,
                                { setSubmitting, setErrors }
                            ) => {
                                console.log(
                                    "Form submitted - values: ",
                                    values
                                );
                                setSubmitting(true);
                                setAllButtonsDisabled(true);
                                setIsLoading(true);
                                Keyboard.dismiss();

                                const sentOTPSuccessfully = await sendEmailOTP(
                                    values.email
                                );

                                if (sentOTPSuccessfully) {
                                    setSubmitting(false);
                                    setAllButtonsDisabled(false);
                                    setIsLoading(false);
                                    // router.replace(`/auth/completeRegistration?email=${values.email}`);
                                    router.replace({
                                        pathname: "/auth/completeRegistration",
                                        params: {
                                            email: values.email,
                                        },
                                    });
                                } else {
                                    setSubmitting(false);
                                    setAllButtonsDisabled(false);
                                    setIsLoading(false);
                                    setErrors({
                                        email: "There was a problem sending your OTP. Please try again",
                                    });
                                }
                            }}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                touched,
                                errors,
                                isSubmitting,
                            }) => (
                                <View>
                                    <View className={`mb-4`}>
                                        <AppTextInput
                                            onChangeText={handleChange("email")}
                                            onBlur={handleBlur("email")}
                                            value={values.email}
                                            keyboardType="email-address"
                                            placeholder="Email"
                                            customStyles={`mb-2 ${
                                                touched.email && errors.email
                                                    ? "bg-red-100/70 dark:bg-red-200/50 border-red-100/70 dark:border-red-200/10 border-r-red-200 dark:border-r-red-200/30 border-b-red-200 dark:border-b-red-200/30"
                                                    : ""
                                            }`}
                                        />
                                        {touched.email && errors.email ? (
                                            <AppText
                                                customStyles={`text-red-400 text-[15px] text-center dark:text-red-400/80`}
                                            >
                                                {errors.email}
                                            </AppText>
                                        ) : null}
                                    </View>
                                    {/* CONTINUE BTN */}
                                    <AppButton
                                        buttonText="CONTINUE WITH EMAIL"
                                        disabled={
                                            isSubmitting || allButtonsDisabled
                                        }
                                        onPress={() => handleSubmit()}
                                    />
                                </View>
                            )}
                        </Formik>
                    </View>

                    <View className="gap-4">{/* VERIFIED BY */}</View>

                    <View className="mt-8 flex-row flex-wrap space-x-0.5 items-center justify-center">
                        <AppText customStyles="text-center text-[15px] text-gray-500">
                            Continuing means you accept our{" "}
                        </AppText>
                        <TouchableOpacity
                            onPress={async () =>
                                await openBrowserAsync(
                                    AppConfig.EXPO_PUBLIC_TERMS_OF_SERVICE_LINK,
                                    async () => {}
                                )
                            }
                        >
                            <AppText customStyles="text-center text-[15px] underline">
                                Terms of Service
                            </AppText>
                        </TouchableOpacity>
                        <AppText customStyles="text-center text-[15px] text-gray-500">
                            {" "}
                            and
                        </AppText>
                        <TouchableOpacity
                            onPress={async () =>
                                await openBrowserAsync(
                                    AppConfig.EXPO_PUBLIC_PRIVACY_POLICY_LINK,
                                    async () => {}
                                )
                            }
                        >
                            <AppText customStyles="text-center text-[15px] underline">
                                Privacy Policy
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </RootView>
    );
};

export default login;
