import { requests } from "@/services/requests/requests";
import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchAllTasks = async (params:Record<string, string>): Promise<any> => {
    let queryParams = new URLSearchParams(params).toString()

    const response = await axios.get(requests.getTasks + `?${queryParams}`);
    return response.data;
};

export const useFetchAllTasks = (options?: { params: any, enabled?: boolean }) => {
    return useQuery({
        queryKey: ["tasks", options?.params],
        queryFn: () => fetchAllTasks(options?.params || {}),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};

const fetchTaskOnStatus = async (id: number, params:Record<string, string>): Promise<any> => {
    let queryParams = new URLSearchParams(params).toString()

    const response = await axios.get(requests.getTaskOnStatus + id + `?${queryParams}`);
    return response.data;
};

export const useFetchTaskOnStatus = (options?: { id: number, params: any, enabled?: boolean }) => {
    return useQuery({
        queryKey: ["statusTasks", options?.params],
        queryFn: () => fetchTaskOnStatus( options?.id || 0, options?.params || {}),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};

const fetchTaskCount = async (id:number, params:Record<string, string>): Promise<any> => {
    let queryParams = new URLSearchParams(params).toString()
    const response = await axios.get(requests.totalTaskCount + `/${id}`);
    return response.data;
};

export const useFetchTaskCount = (options?: { id: number, enabled?: boolean }) => {
    return useQuery({
        queryKey: ["taskCount", options?.id],
        queryFn: () => fetchTaskCount(options?.id!, {}),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};

export const useMultipleTaskCount = (options?: { data: any[], params?: any }) => {
    return useQueries ({
        queries: options?.data?.map((data: any) => ({
            queryKey: ["multipleTaskCount", data?.tasks?.requesterProfileId ?? data.requesterProfileId],
            queryFn: () => fetchTaskCount(data?.tasks?.requesterProfileId ?? data.requesterProfileId, options?.params || {}),
            enabled: !!data.requesterProfileId,
            staleTime: 5 * 60 * 1000,
        })) || []
    })
};