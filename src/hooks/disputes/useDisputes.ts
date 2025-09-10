import { requests } from "@/services/requests/requests";
import { useQuery } from '@tanstack/react-query'
import axios from "axios";

const fetchDisputePolicies = async () => {
    const response = await axios.get(`${requests.disputePoliciesList}?page=1&limit=1&status=PUBLISHED`);
    return response.data;
};

export const useFetchDisputePolicy = () => {
    return useQuery({
        queryKey: ["disputePolicies"],
        queryFn: fetchDisputePolicies,
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    })
};
