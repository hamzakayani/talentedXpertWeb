import { requests } from "@/services/requests/requests";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUserInfo = async () => {
  const response = await axios.get(requests.getUserInfo);
  return response.data;
};

export const useFetchUserInfo = () => {
  return useQuery({
    queryKey: ["userinfo"],
    queryFn: fetchUserInfo,
    staleTime: 5 * 60 * 1000,
  });
};