import { requests } from "@/services/requests/requests";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSkills = async () => {
  const response = await axios.get(requests.getSkills);
  console.log(response)
  return response.data;
};

const addSkills = async (names: string[]): Promise<any> => {
  const response = await axios.post(requests.getSkills, { names });
  return response.data;
};

export const useAddSkill = () => {
    return useMutation({
        mutationFn: addSkills,
    });
};

export const useFetchSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
    staleTime: 5 * 60 * 1000,
  });
};
