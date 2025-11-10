import { requests } from "@/services/requests/requests";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchPromotion = async (params:Record<string, string>): Promise<any> => {
    let queryParams = new URLSearchParams(params).toString()

    const response = await axios.get(requests.promotion + `?${queryParams}`);
    return response.data;
};

export const useFetchPromotion = (options?: { params: any, enabled?: boolean }) => {
    return useQuery({
        queryKey: ["promotion", options?.params],
        queryFn: () => fetchPromotion(options?.params || {}),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};