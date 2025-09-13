"use client";
import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react';

interface StatsCardProps {
  label: string;
  value: string;
  icon?: any;
  change?: { type?: "new" | "positive" | "negative"; value?: number };
}

const StatsCard = ({ stats }: { stats: StatsCardProps[] }) => {
    const getBadgeClass = (type?: "new" | "positive" | "negative") => {
        switch (type) {
        case "new":
            return "text-white";
        case "positive":
            return "text-white";
        case "negative":
            return "text-white";
        default:
            return "";
        }
    };

    return (
        <div className="row gy-3">
            {stats.map((s, idx) => (
                <div key={idx} className="col-xl-3 col-md-6">
                    <div className="stat-card">
                        <div className="d-flex align-items-start mb-3 ">
                            <div className="me-3 icon-box">
                                {s.icon ? <HugeiconsIcon icon={s.icon} size={24} /> : null}
                            </div>
                            <div className="ms-auto text-end">
                                {/* Badge */}
                                {s.change && (
                                    <span
                                        className={`translate-middle-y mt-2 me-2 badge ${getBadgeClass(
                                            s.change.type
                                        )}`}
                                    >
                                        {s.change.type === "new"
                                            ? "New"
                                                : s.change.type === "positive"
                                                ? `+${s.change.value}`
                                                    : `-${s.change.value}`}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="d-flex align-items-start ">
                            <div>
                                <div className="h5 mb-0">{s.value}</div>
                                <div className="small">{s.label}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default StatsCard
