import { requests } from "@/services/requests/requests";
import { useQuery } from '@tanstack/react-query'
import axios from "axios";

const fetchAboutUs = async () => {
    const response = await axios.get(`${requests.aboutusList}?page=1&limit=1&status=PUBLISHED`);
    return response.data;
};

export const useFetchAboutUs = () => {
    return useQuery({
        queryKey: ["aboutus"],
        queryFn: fetchAboutUs,
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    })
};
