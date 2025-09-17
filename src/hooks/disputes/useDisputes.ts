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

const fetchAllDisputes = async (params:Record<string, string>): Promise<any> => {
    let queryParams = new URLSearchParams(params).toString()
    const response = await axios.get(requests.dispute + `?${queryParams}`);
    return response.data;
};

export const useFetchAllDisputes = (options?: { params: any, enabled?: boolean }) => {
    return useQuery({
        queryKey: ["disputes", options?.params],
        queryFn: () => fetchAllDisputes(options?.params || {}),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};
