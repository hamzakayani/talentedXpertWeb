'use client'
import React from "react";
import StatsCard from "../common/cards/StatsCard";
import NewCard from "../common/cards/newCard";
import { BriefcaseDollarIcon, MessageSecure02Icon, Note01Icon } from "@hugeicons/core-free-icons";
import ProfileCard from "../common/cards/ProfileCard";
import SearchFilter from "./SearchFilter/SearchFilter";

interface StatsCardProps {
  label: string;
  value: string;
  icon?: any;
  change?: { type?: "new" | "positive" | "negative"; value?: number };
}

const Dashboard = () => {
    const stats: StatsCardProps[] = [
        { label: "Total Earnings", value: "$0", icon: BriefcaseDollarIcon, change: { type: "negative", value: 1 }, },
        { label: "Active Tasks", value: "8", icon: Note01Icon, change: { type: "positive", value: 7 }, },
        { label: "Sent Proposals", value: "14", icon: null, change: { type: "positive", value: 7 }, },
        { label: "Unread Messages", value: "60", icon: MessageSecure02Icon, change: { type: "new" }, },
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
                <SearchFilter  onSearch={(q) => console.log("search", q)} />

                {/* Task Cards */}
                <div className="row row-gap-4 mt-1">
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((i) => {
                        return (
                            <div className="col-md-6 col-lg-4" key={i}>
                                <NewCard key={i} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
