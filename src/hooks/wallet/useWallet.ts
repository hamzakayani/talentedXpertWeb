import { requests } from "@/services/requests/requests";
import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchTotalEarning = async (id:number | null) :Promise<any> => {
    const response = await axios.get(requests.totalEarnings + (id ? `/${id}` : ''));
    return response.data;
};

export const useFetchTotalEarning = (options?: { id?: number, enabled?: boolean }) => {
    return useQuery({
        queryKey: ["totalEarnings", options?.id],
        queryFn: () => fetchTotalEarning(options?.id! ?? null),
        staleTime: 5 * 60 * 1000,
        enabled: !!options?.id,
        ...options,
    });
};

const fetchTotalSpending = async (id: number | null) :Promise<any> => {
    const response = await axios.get(requests.spendings + (id ? `/${id}` : ''));
    return response.data;
};

export const useFetchTotalSpending = (options?: { id?: number, enabled?: boolean }) => {
    return useQuery({
        queryKey: ["totalSpending", options?.id],
        queryFn: () => fetchTotalSpending(options?.id! ?? null),
        staleTime: 5 * 60 * 1000,
        enabled: !!options?.id,
        ...options,
    });
};

export const useMultipleTotalSpending = (options?: { data: any[]}) => {
    return useQueries ({
        queries: options?.data?.map((data: any) => ({
            queryKey: ["multipleSpending", data?.tasks?.requesterProfileId ?? data.requesterProfileId],
            queryFn: () => fetchTotalSpending(data?.tasks?.requesterProfileId ?? data.requesterProfileId),
            enabled: !!data.requesterProfileId,
            staleTime: 5 * 60 * 1000,
        })) || []
    })
}