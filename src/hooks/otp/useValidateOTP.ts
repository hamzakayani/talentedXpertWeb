import { useMutation } from "@tanstack/react-query";
import { requests } from "@/services/requests/requests";
import axios from "axios";

interface ValidateOTPPayload {
    token: string;
}

const validateOtp = async (payload: ValidateOTPPayload):Promise<any> => {
    const response = await axios.post(`${requests.validateOTP}`, payload);
    return response;
};

export const useValidateOTP = () => {
    return useMutation({
        mutationFn: validateOtp,
    });
};

interface SendOTPPayload {
    email: string;
    firstName: string;
    lastName: string;
}

const sendOtp = async (payload: SendOTPPayload):Promise<any> => {
    const response = await axios.post(`${requests.sendOtp}`, payload);
    return response;
};

export const useSendOTP = () => {
    return useMutation({
        mutationFn: sendOtp,
    });
};

interface VerifyOTPPayload {
    email: string;
    otp: string;
}

const verifyOtp = async (payload: VerifyOTPPayload):Promise<any> => {
    const response = await axios.post(`${requests.verifyOtp}`, payload);
    return response;
};

export const useVerifyOTP = () => {
    return useMutation({
        mutationFn: verifyOtp,
    });
};