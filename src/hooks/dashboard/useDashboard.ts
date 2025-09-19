import { requests } from "@/services/requests/requests";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchDashboardData = async (): Promise<any> => {
    const response = await axios.get(requests.getUserDashboard);
    return response.data;
};

export const useFetchDashboardData = (options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["dashboardData"],
        queryFn: () => fetchDashboardData(),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};
