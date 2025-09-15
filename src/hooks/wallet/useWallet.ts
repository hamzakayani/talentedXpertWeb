import { requests } from "@/services/requests/requests";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchTotalEarning = async (id:number) :Promise<any> => {
    const response = await axios.get(requests.totalEarnings + `/${id}`);
    return response.data;
};

export const useFetchTotalEarning = (options?: { id: number, enabled?: boolean }) => {
    return useQuery({
        queryKey: ["totalEarnings", options?.id],
        queryFn: () => fetchTotalEarning(options?.id!),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};