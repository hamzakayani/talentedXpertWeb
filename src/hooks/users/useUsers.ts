import { requests } from "@/services/requests/requests";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUserInfo = async () => {
  const response = await axios.get(requests.getUserInfo);
  return response.data;
};

export const useFetchUserInfo = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["userinfo"],
    queryFn: fetchUserInfo,
    staleTime: 5 * 60 * 1000,
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