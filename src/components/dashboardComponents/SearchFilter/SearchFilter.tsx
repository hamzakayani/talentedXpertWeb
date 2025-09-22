"use client";
import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  EnergyIcon,
  Search01Icon,
  WheelchairIcon,
} from "@hugeicons/core-free-icons";
import useDebounce from "@/hooks/useDebounce";

interface SearchFilterProps {
  title?: string;
  onSearch?: (q: string) => void;
  promoted?: boolean;
  onPromotedChange?: (promoted: boolean) => void;
  disability?: boolean;
  onDisabilityChange?: (disability: boolean) => void;
  hideFilters?: boolean;
  placeholder?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  title,
  onSearch,
  promoted = false,
  onPromotedChange,
  disability = false,
  onDisabilityChange,
  hideFilters = false,
  placeholder = "Search by role, skills, or keywords",
}) => {
  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState("for-you");
  const debouncedQ = useDebounce(q, 600);

  const handleSearch = () => {
    onSearch?.(q);
  };

  const handlePromotedChange = () => {
    onPromotedChange?.(!promoted);
  };

  const handleDisabilityChange = () => {
    onDisabilityChange?.(!disability);
  };

  useEffect(() => {
    onSearch?.(debouncedQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  return (
    <div className="search-filter-panel">
      {/* Heading */}
      {title && <h4 className="panel-title">{title}</h4>}
      {/* Search + Filters */}
      <div className="search-filter-bar">
        {/* Search Box */}
        <div className="search-box">
          <input
            className="search-input"
            placeholder={placeholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button type="button" className="search-btn" onClick={handleSearch}>
            <HugeiconsIcon icon={Search01Icon} size={18} />
            <span className="d-none d-md-inline ms-1">Search</span>
          </button>
        </div>

        {/* Toggles */}
        {!hideFilters && (
          <div className="toggle-group">
            <div className="toggle-container">
              <HugeiconsIcon icon={EnergyIcon} size={18} className="me-1" />
              <label
                className="form-check-label"
                htmlFor="promotedSwitch"
                style={{ marginRight: "10px" }}
              >
                Promoted
              </label>
              <input
                className={`form-check-input ${promoted ? "bg-gradient1" : ""}`}
                type="checkbox"
                id="promotedSwitch"
                checked={promoted}
                onChange={handlePromotedChange}
              />
            </div>
            <div className="toggle-container">
              <HugeiconsIcon icon={WheelchairIcon} size={18} className="me-1" />
              <label
                className="form-check-label"
                htmlFor="disabilitySwitch"
                style={{ marginRight: "10px" }}
              >
                Disability
              </label>
              <input
                className={`form-check-input ${disability ? "bg-gradient3" : ""}`}
                type="checkbox"
                id="disabilitySwitch"
                checked={disability}
                onChange={handleDisabilityChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
