import { requests } from "@/services/requests/requests";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchAllProposals = async (params:Record<string, string>): Promise<any> => {
    let queryParams = new URLSearchParams(params).toString()

    const response = await axios.get(requests.getProposals + `?${queryParams}`);
    return response.data;
};

export const useFetchAllProposals = (options?: { params: any, enabled?: boolean }) => {
    return useQuery({
        queryKey: ["proposals", options?.params],
        queryFn: () => fetchAllProposals(options?.params || {}),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};