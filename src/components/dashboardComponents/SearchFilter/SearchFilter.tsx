"use client";
import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { EnergyIcon, Search01Icon, WheelchairIcon } from "@hugeicons/core-free-icons";

interface SearchFilterProps {
    onSearch?: (q: string) => void;
    promoted?: boolean;
    onPromotedChange?: (promoted: boolean) => void;
    disability?: boolean;
    onDisabilityChange?: (disability: boolean) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ 
    onSearch, 
    promoted = false, 
    onPromotedChange, 
    disability = false, 
    onDisabilityChange 
}) => {
    const [q, setQ] = useState("");
    const [activeTab, setActiveTab] = useState("for-you");

    const handleSearch = () => {
        onSearch?.(q);
    };

    const handlePromotedChange = () => {
        onPromotedChange?.(!promoted);
    };

    const handleDisabilityChange = () => {
        onDisabilityChange?.(!disability);
    };

    return (
        <div className="search-filter-panel">
            {/* Heading */}
            <h2 className="panel-title">Opportunities we have for you</h2>
            {/* Search + Filters */}
            <div className="search-filter-bar">
                {/* Search Box */}
                <div className="search-box">
                    <input
                        className="search-input"
                        placeholder="Search by role, skills, or keywords"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                        type="button"
                        className="search-btn"
                        onClick={handleSearch}
                    >
                        <HugeiconsIcon icon={Search01Icon} size={18} />
                        <span className="d-none d-md-inline ms-1">Search</span>
                    </button>
                </div>

                {/* Toggles */}
                <div className="toggle-group">
                    <div className="toggle-container">
                        <HugeiconsIcon icon={EnergyIcon} size={18} className="me-1" />
                        <label className="form-check-label" htmlFor="promotedSwitch" style={{ marginRight: '10px' }}>
                            Promoted
                        </label>
                        <input
                            className={`form-check-input ${promoted ? 'bg-gradient1' : ''}`}
                            type="checkbox"
                            id="promotedSwitch"
                            checked={promoted}
                            onChange={handlePromotedChange}
                        />
                    </div>
                    <div className="toggle-container">
                        <HugeiconsIcon icon={WheelchairIcon} size={18} className="me-1" />
                        <label className="form-check-label" htmlFor="disabilitySwitch" style={{ marginRight: '10px' }}>
                            Disability
                        </label>
                        <input
                            className={`form-check-input ${disability ? 'bg-gradient3' : ''}`}
                            type="checkbox"
                            id="disabilitySwitch"
                            checked={disability}
                            onChange={handleDisabilityChange}
                        />
                    </div>
                </div>

            </div>
            {/* Tabs */}
            {/* <ul className="nav nav-pills filter-tabs">
                <li className="nav-item">
                <button
                    type="button"
                    className={`nav-link ${activeTab === "for-you" ? "active" : ""}`}
                    onClick={() => setActiveTab("for-you")}
                >
                    For You
                </button>
                </li>
                <li className="nav-item">
                <button
                    type="button"
                    className={`nav-link ${activeTab === "applied" ? "active" : ""}`}
                    onClick={() => setActiveTab("applied")}
                >
                    Applied
                </button>
                </li>
                <li className="nav-item">
                <button
                    type="button"
                    className={`nav-link ${activeTab === "saved" ? "active" : ""}`}
                    onClick={() => setActiveTab("saved")}
                >
                    Saved Tasks
                </button>
                </li>
            </ul> */}
        </div>
    );
};

export default SearchFilter;
