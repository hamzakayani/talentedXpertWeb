import { requests } from "@/services/requests/requests";
import { useQuery } from '@tanstack/react-query'
import axios from "axios";

const fetchPromotedTasks = async () => {
  const params = "?promoted=true&limit=6";
  const response = await axios.get(`${requests.getTasks}${params}`);
  return response?.data
};

export const useFetchPromotedTasks = () => {
    return useQuery({
        queryKey: ["promotedTasks"],
        queryFn: fetchPromotedTasks,
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    })
};

const fetchTalentedXpert = async () => {
  const params = "?promoted=true&limit=6";
  const response = await axios.get(`${requests.getUserAll}${params}`);
  return response?.data;
};


export const useFetchTalentedXperts = () => {
    return useQuery({
        queryKey: ["talentedXperts"],
        queryFn: fetchTalentedXpert,
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    })
};


const fetchCategories = async () => {
  const response = await axios.get(`${requests.getCategory}?level=1`);
  return response?.data
};

export const useFetchCategories= () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    })
};