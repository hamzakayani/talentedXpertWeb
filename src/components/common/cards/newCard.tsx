"use client";

import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import HtmlData from "../HtmlData/HtmlData";
import { useRouter } from "next/navigation";
import { WheelchairIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { getTimeago } from "@/services/utils/util";

interface NewCardProps {
  task?: any;
}

const NewCard: React.FC<NewCardProps> = ({ task }) => {
  const router = useRouter();
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  return (
    <div className={`new-card ${task?.disability ? 'border-gradient3' : ''}`} onClick={() => !isAuth ? router.push(`/signin`) : router.push(`/dashboard/tasks/${task?.id}`)} style={{ cursor: "pointer" }}>
      {/* Disability Badge */}
      {task?.disability &&
        <div className="disablity bg-gradient3 rounded-5 w-auto px-4 d-flex align-items-center gap-2 maxw-auto text-dark position-absolute" style={{ top: '-13px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <HugeiconsIcon icon={WheelchairIcon} />
          <span className="fw-medium">Disability</span>
        </div>
      }
      {/* Top Section */}
      <div className="card-header">
        <div className="header-left">
          {/* Online / Onsite */}
          <div className="urgent-tag">
            <span className="urgent-text">{task?.taskType}</span>
          </div>
          {/* Urgent Tag */}
          <div className="urgent-tag">
            <span className="urgent-text">{task?.amountType}</span>
          </div>
          {/* Posted Time */}
          <span className="posted-time">
            Posted{" "}
            {task?.createdAt
              // ? new Date(task.createdAt).toLocaleDateString()
              ? getTimeago(task?.createdAt)
              : ""}
          </span>
        </div>
        {/* Promoted Badge */}
        {task?.promoted &&
          <span className={`ribbin text-dark`} style={{marginRight: '-20px'}}>Promoted</span>
        }
        {/* Bookmark Icon */}
        {/* <div className="bookmark-icon">
          <Icon icon="solar:bookmark-outline" />
        </div> */}
      </div>

      {/* Job Title */}
      <p className="job-title">{task?.name}</p>

      {/* Job Description */}
      <HtmlData
        data={task?.details}
        className="job-description"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 3,
          overflow: "hidden",
        }}
        isDark={true}
      />

      {/* Job Details Section */}
      <div className="job-details">
        <div className="tags-container">
            {task?.categories?.length > 0 &&
            task?.categories[0]?.category?.parentCategory && (
              <div className="skill-tag intermediate" style={{ pointerEvents: "none" }}>
                <span>
                  {task?.categories?.length > 0 &&
                    task?.categories[0]?.category?.parentCategory?.name}
                </span>
              </div>
            )}
            {task?.categories?.map((cat: any, id: number) => (
              <div className="skill-tag fixed-price" style={{ pointerEvents: "none" }} key={id}>
                <span>
                  {cat?.category?.name}
                </span>
              </div>
            ))}
        </div>
        {/* Budget */}
        <div className="budget-section">
          <span className="budget-label">Est. Budget:</span>
          <h4 className="budget-amount">
            ${task?.amount}{task?.amountType?.toUpperCase() === "HOURLY" ? "/hr" : ""}
          </h4>
        </div>
      </div>

      {/* Divider */}
      <div className="divider"></div>

      {/* Requester Information */}
      <div className="requester-info">
        <div className="requester-left">
          {/* Company Name with Online Status */}
          <div className="company-info">
            <span className="company-name">{task?.companyName}</span>
            {/* <div className="online-dot"></div> */}
          </div>
          {/* Rating */}
          <div className="rating-text">
            {task?.requesterProfile?.averageRating || 4}/5 Requestor Rating
          </div>
          {/* Star Rating */}
          <div className="star-rating">
            {[
              ...Array(Math.floor(task?.requesterProfile?.averageRating || 4)),
            ].map((_, i) => (
              <Icon key={i} icon="solar:star-bold" className="star-filled" />
            ))}
            {[
              ...Array(
                5 - Math.floor(task?.requesterProfile?.averageRating || 4)
              ),
            ].map((_, i) => (
              <Icon
                key={i}
                icon="solar:star-outline"
                className="star-outline"
              />
            ))}
          </div>
        </div>

        {/* Right Side Stats */}
        <div className="requester-stats">
          <div className="stat-item">
            Total tasks: {task?.taskCount ?? 0}
          </div>
          <div className="stat-item">
            Total Spent: ${task?.totalSpent ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCard;
