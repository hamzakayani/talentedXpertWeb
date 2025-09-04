import { requests } from "@/services/requests/requests";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface SosLoginPayload {
  token: string;
  roleId: number;
  redirectUrl: string;
  profileType: string;
}

interface SosLoginResponse {
  data: {
    access_token: string;
  };
}

const googleLoginUser = async (loginData: SosLoginPayload): Promise<SosLoginResponse> => {
  const response = await axios.post(`${requests.sosLogin}google`, loginData);
  return response.data;
};

const linkedLoginUser = async (loginData: SosLoginPayload): Promise<SosLoginResponse> => {
  const response = await axios.post(`${requests.sosLogin}linkedin`, loginData);
  return response.data;
};

export const usePostGoogleSOSLogin = () => {
  return useMutation({
    mutationFn: googleLoginUser,
  });
};

export const usePostLinkedinSOSLogin = () => {
  return useMutation({
    mutationFn: linkedLoginUser,
  });
};