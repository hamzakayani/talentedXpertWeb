"use client";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: any;
  change?: { type?: "new" | "positive" | "negative"; value?: number };
  onClick?: () => void;
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

  const formatValue = (value: string | number) => {
    if (typeof value === "number") return value.toFixed(2);
    return value as any;
  };

  return (
    <div className="row gy-1 gy-md-3 gx-1 gx-md-3">
      {stats.map((s, idx) => (
        <div
          key={idx}
          className="col-xl-3 col-6"
          onClick={s.onClick}
          style={{ cursor: s.onClick ? "pointer" : "default" }}
        >
          <div className="stat-card">
            <div className="d-flex align-items-start mb-1 mb-md-3 ">
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
                <h4 className=" mb-0">{formatValue(s.value)}</h4>
                <p className="mb-0">{s.label}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
