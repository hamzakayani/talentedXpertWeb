import { requests } from "@/services/requests/requests";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

const fetchUserInfo = async () => {
  const response = await axios.get(requests.getUserInfo);
  return response.data;
};

export const useFetchUserInfo = (options?: { enabled?: boolean }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  
  return useQuery({
    queryKey: ["userinfo", token],
    queryFn: fetchUserInfo,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 0,
    enabled: options?.enabled ?? true,
    ...options,
  });
};

const updateUserInfo = async (userData:any): Promise<any> => {
  const {id, ...formData} = userData
  const response = await axios.put(requests.editUser + id, {...formData});
  return response.data
}

export const useUpdateUserInfo = () => {
  return useMutation({
    mutationFn: updateUserInfo,
  });
};

const fetchAllUsers = async (params:Record<string, string>): Promise<any> => {
  let queryParams = new URLSearchParams(params).toString()
  const response = await axios.get(requests.getUserAll + `?${queryParams}`);
  return response.data;
};

export const useFetchAllUsers = (options?: { params: any, enabled?: boolean }) => {
  return useQuery({
    queryKey: ["users", options?.params],
    queryFn: () => fetchAllUsers(options?.params || {}),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};