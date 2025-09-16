"use client"
import React, { FC, useState } from 'react'
import Sidebar, { TabKey } from '../common/Sidebar/Sidebar';
import { BriefcaseDollarIcon, MessageSecure02Icon, Note01Icon, Sent02Icon } from "@hugeicons/core-free-icons";
import StatsCard from '../common/cards/StatsCard';
import ProfileCard from '../common/cards/ProfileCard';
import { useNavigation } from '@/hooks/useNavigation';
import { useFetchTotalEarning } from '@/hooks/wallet/useWallet';
import { useSelector } from 'react-redux';
import { RootState } from '@/reducers/Reducer';
import { useFetchAllTasks } from '@/hooks/tasks/useTasks';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon?: any;
    change?: { type?: "new" | "positive" | "negative"; value?: number };
    onClick?: () => void;
}

const DashboardLayout:FC<any> = ({ children}) => {
    const [activeTab, setActiveTab] = useState<TabKey>("home");
    const { navigate } = useNavigation() 

    const user = useSelector((state: RootState) => state.user);

    const earningsData = useFetchTotalEarning({id: user?.id, enabled: !!user?.id})
    const activeTasks = useFetchAllTasks({params: {status:"INPROGRESS"}, enabled: !!user?.id})

    const stats: StatsCardProps[] = [
        { label: "Total Earnings", value: `$${typeof earningsData?.data?.totalEarned === 'string' && parseFloat(earningsData?.data?.totalEarned).toFixed(2) || earningsData?.data?.totalEarned.toFixed(2) || 0}`, icon: BriefcaseDollarIcon, change: { type: "negative", value: 1 }, },
        { label: "Active Tasks", value: activeTasks?.data?.data?.count?.toFixed(0) || 0, icon: Note01Icon, change: { type: "positive", value: 7 }, },
        { label: "Sent Proposals", value: "14", icon: Sent02Icon , change: { type: "positive", value: 7 }, },
        { label: "Unread Messages", value: "60", icon: MessageSecure02Icon, change: { type: "new" }, onClick: () => navigate('/dashboard/messages')},
    ];

    return (
        <div className="app-shell">
            <Sidebar active={activeTab} onChange={setActiveTab} />
            <main className="main-area">
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
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout