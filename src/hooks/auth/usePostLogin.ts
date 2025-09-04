import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = process.env.BASE_URL;

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
  loginAs: string;
}

interface LoginResponse {
  data: {
    access_token: string;
  };
}

const loginUser = async (loginData: LoginData): Promise<LoginResponse> => {
  const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
  return response.data;
};

export const usePostLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
