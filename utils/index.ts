import axiosInstance from "@/lib/axios";

export const sendEmailOTP = async (email: string) => {
    console.log("sending email otp...");

    try {
        const response = await axiosInstance.post(
            `/api/v1/auth/send-otp?channel=email`,
            {
                email,
            }
        );

        console.log("OTP response: ", response.data);

        return response.status === 200 && response.data.success;
    } catch (error) {
        console.log("Unable to send OTP: ", error);
    }
};

export const capitalizeString = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);