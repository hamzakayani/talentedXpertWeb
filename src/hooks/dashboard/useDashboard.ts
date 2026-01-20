import { requests } from "@/services/requests/requests";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchDashboardData = async (): Promise<any> => {
  const response = await axios.get(requests.getUserDashboard);
  return response.data;
};

interface UseDashboardOptions {
  enabled?: boolean;
  profileType?: string | null;
}

export const useFetchDashboardData = (options?: UseDashboardOptions) => {
  const { enabled, profileType } = options || {};

  return useQuery({
    // Include profileType in the key so switching profiles forces a fresh fetch
    queryKey: ["dashboardData", profileType || "default"],
    queryFn: () => fetchDashboardData(),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
};
