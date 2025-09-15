'use client'
import React, { useEffect, useState } from "react";
import StatsCard from "../common/cards/StatsCard";
import NewCard from "../common/cards/newCard";
import { BriefcaseDollarIcon, MessageSecure02Icon, Note01Icon } from "@hugeicons/core-free-icons";
import ProfileCard from "../common/cards/ProfileCard";
import SearchFilter from "./SearchFilter/SearchFilter";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/Reducer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { requests } from "@/services/requests/requests";
import { Pagination } from "../common/Pagination/Pagination";
import { useRouter } from "next/navigation";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: any;
  change?: { type?: "new" | "positive" | "negative"; value?: number };
  onClick?: () => void;
}

const Dashboard = () => {
    const user = useSelector((state: RootState) => state.user);
    const [totalEarnings, setTotalEarnings] = useState("$0");
    const [searchQuery, setSearchQuery] = useState("");
    const [promoted, setPromoted] = useState(true);
    const [disability, setDisability] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const router = useRouter();

    // Fetch total earnings using React Query (same pattern as sign-in page)
    const { data: earningsData, isLoading: earningsLoading } = useQuery({
        queryKey: ['totalEarnings', user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const response = await axios.get(`${requests.totalEarnings}/${user.id}`);
            console.log('response wallet', response);
            return response.data;
        },
        enabled: !!user?.id,
    });

    // Fetch tasks with filters
    const { data: tasksData, isLoading: tasksLoading } = useQuery({
        queryKey: ['tasks', searchQuery, promoted, disability, page, limit],
        queryFn: async () => {
            let params = new URLSearchParams();
            params.append('page', String(page));
            params.append('limit', String(limit));
            params.append('promoted', promoted.toString());
            params.append('disability', disability.toString());
            params.append('status', 'INPROGRESS');
            if (searchQuery.trim()) {
                params.append('name', searchQuery.trim());
            }

            const response = await axios.get(`${requests.getTasks}?${params.toString()}`);
            console.log('response tasks', response);
            const data = response?.data?.data;
            return {
                tasks: data?.tasks || [],
                count: data?.count || 0,
            };
        },
        enabled: true,
    });

    useEffect(() => {
        if (earningsData) {
            console.log('earningsData', earningsData);
            setTotalEarnings(`$${earningsData.totalEarned || 0}`);
        }
    }, [earningsData]);

    const stats: StatsCardProps[] = [
        { label: "Total Earnings", value: totalEarnings, icon: BriefcaseDollarIcon, change: { type: "negative", value: 1 }, },
        { label: "Active Tasks", value: tasksData?.count || 0, icon: Note01Icon, change: { type: "positive", value: 7 }, },
        { label: "Sent Proposals", value: "14", icon: null, change: { type: "positive", value: 7 }, },
        { label: "Unread Messages", value: "60", icon: MessageSecure02Icon, change: { type: "new" }, onClick: () => { router.push('/dashboard/messages'); } },
    ];

    return (
        <div>
            {/* Stats + Profile */}
            <div className="row align-items-stretch mb-4">
                <div className="col-lg-9">
                    <div className="panel">
                        <StatsCard stats={stats} />
                    </div>
                </div>

                <div className="col-lg-3 mt-3 mt-lg-0">
                    <ProfileCard />
                </div>
            </div>

            <div className="dashboard-card">
                {/* Search Filters  */}
                <SearchFilter  
                    onSearch={(q) => setSearchQuery(q)} 
                    promoted={promoted}
                    onPromotedChange={setPromoted}
                    disability={disability}
                    onDisabilityChange={setDisability}
                />

                {/* Task Cards */}
                <div className="row row-gap-4 mt-1">
                    {tasksLoading ? (
                        <div className="col-12 text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : tasksData?.tasks?.length > 0 ? (
                        tasksData?.tasks.map((task: any, index: number) => (
                            <div className="col-md-6 col-lg-4" key={task.id || index}>
                                <NewCard task={task} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p className="text-muted">No tasks found</p>
                        </div>
                    )}
                </div>
                <div className="mt-3">
                    <Pagination
                        limit={limit}
                        count={tasksData?.count || 0}
                        page={page}
                        onLimitChange={(val: number) => setLimit(val)}
                        onPageChange={(val: number) => setPage(val)}
                        siblingCount={1}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
