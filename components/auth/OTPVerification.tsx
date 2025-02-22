import {
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import axios from "axios";
import AppText from "@/components/global/AppText";
import { useRouter } from "expo-router";
import { sendEmailOTP } from "@/utils";
import AppButton from "@/components/global/AppButton";
import { AppStateContext } from "@/contexts/AppStateContext";
import { AppToastContext } from "@/contexts/AppToastContext";
import axiosInstance from "@/lib/axios";
import AppConfig, { AppLocalStorage, AppSecureStore } from "@/config";
import AppCodeInput from "../global/AppCodeInput";

interface OTPVerificationProps {
    email: string;
    OTPIsVerified: boolean;
    setOTPIsVerified: Dispatch<SetStateAction<boolean>>;
    setUserProfile: Dispatch<
        React.SetStateAction<Record<string, string> | null>
    >;
}

const OTPVerification = ({
    email,
    OTPIsVerified,
    setOTPIsVerified,
    setUserProfile,
}: OTPVerificationProps) => {
    const [otp, setOtp] = useState<string[]>(
        Array(AppConfig.OTP_LENGTH).fill("")
    );
    const [resendCounter, setResendCounter] = useState(
        AppConfig.OTP_RESEND_DELAY
    );
    const [errorMessage, setErrorMessage] = useState("");
    const { setIsLoading } = useContext(AppStateContext);
    const { notifySuccess, notifyError } = useContext(AppToastContext);

    const router = useRouter();

    useEffect(() => {
        if (resendCounter > 0 && !OTPIsVerified) {
            setTimeout(() => {
                setResendCounter(resendCounter - 1);
            }, 1000);
        }
    }, [resendCounter]);

    const resendEmailOTP = async () => {
        setIsLoading(true);
        const OTPSentSuccessfully = await sendEmailOTP(email as string);

        if (OTPSentSuccessfully) {
            notifySuccess("The OTP has been resent to your email address");
        } else {
            notifyError(
                "We encountered an issue while resending the OTP. Please try again"
            );
        }

        setResendCounter(AppConfig.OTP_RESEND_DELAY);
        setOtp(Array(AppConfig.OTP_LENGTH).fill(""));
        setErrorMessage("");
        setIsLoading(false);
    };

    const verifyEmailOTP = async () => {
        Keyboard.dismiss();
        setIsLoading(true);
        const otpValue = otp.join("");
        console.log("OTP: ", otpValue);

        try {
            const response = await axiosInstance.post(
                `/api/v1/auth/verify-otp?channel=email`,
                { email, OTPFromUser: otpValue }
            );
            console.log("OTP Verification Response: ", response.data);

            if (response.status === 200 && response.data.success) {
                console.log("OTP verified successfully");

                const { isNewAccount, userProfile } = response.data;

                if (isNewAccount) {
                    setOTPIsVerified(true);
                    setUserProfile(userProfile);
                } else {
                    console.log("user: ", userProfile);
                    const { token, ...userData } = userProfile;
                    await AppSecureStore.set("token", token);
                    await AppLocalStorage.set("user", userData);
                    router.replace(
                        `/${
                            userProfile?.baseProfile?.role
                        }Home?userStringified=${JSON.stringify(userData)}`
                    );
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(
                    "Error verifying OTP (axios): ",
                    error.response?.data
                );
                setErrorMessage(error.response?.data?.message);
            } else {
                console.error("Error verifying OTP (not axios): ", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View className={`pt-20 flex-1 px-7`}>
                <View className="mb-10">
                    <AppText customStyles="font-rubik text-center text-3xl mb-4">
                        Confirm your identity
                    </AppText>
                    <AppText customStyles="text-center text-gray-400">
                        Please enter the 6-digit code sent to your email
                        address, {email}
                    </AppText>
                </View>

                <View className="mb-4">
                    <AppCodeInput
                        errorMessage={errorMessage}
                        code={otp}
                        setCode={setOtp}
                    />
                    {errorMessage && (
                        <AppText customStyles="text-center text-red-400 dark:text-red-400/80 text-sm mt-2">
                            {errorMessage}
                        </AppText>
                    )}
                </View>

                <View className="mb-8">
                    <AppText customStyles="mb-2 text-center">
                        Yet to receive the code?
                    </AppText>
                    <TouchableOpacity
                        onPress={async () => await resendEmailOTP()}
                        disabled={resendCounter > 0}
                        className={`font-semibold `}
                    >
                        <AppText
                            customStyles={`underline text-center ${
                                resendCounter > 0
                                    ? "text-gray-400"
                                    : "text-green-dark dark:text-green-light"
                            }`}
                        >
                            Tap here to resend OTP{" "}
                            {resendCounter > 0 ? `in ${resendCounter}s` : ""}
                        </AppText>
                    </TouchableOpacity>
                </View>

                <View>
                    <AppButton
                        buttonText="VERIFY MY ACCOUNT"
                        customStyles="mb-3"
                        onPress={async () => await verifyEmailOTP()}
                        disabled={otp.join("").length !== AppConfig.OTP_LENGTH}
                    />

                    <TouchableOpacity
                        onPress={() => router.push("/auth/login")}
                    >
                        <AppText customStyles="font-medium tracking-tight text-center">
                            Use a different email
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default OTPVerification;
