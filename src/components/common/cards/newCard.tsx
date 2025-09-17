"use client";

import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import HtmlData from "../HtmlData/HtmlData";
import { useRouter } from "next/navigation";

interface NewCardProps {
  task?: any;
}

const NewCard: React.FC<NewCardProps> = ({ task }) => {
  const router = useRouter();
  console.log("task", task);
  return (
    <div
      className="new-card"
      onClick={() => router.push(`/dashboard/tasks/${task?.id}`)}
      style={{ cursor: "pointer" }}
    >
      {/* Top Section */}
      <div className="card-header">
        <div className="header-left">
          {/* Urgent Tag */}
          <div className="urgent-tag">
            <span className="urgent-text">{task?.amountType}</span>
          </div>
          {/* Posted Time */}
          <span className="posted-time">
            Posted{" "}
            {task?.createdAt
              ? new Date(task.createdAt).toLocaleDateString()
              : ""}
          </span>
        </div>
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
          WebkitLineClamp: 4,
          overflow: "hidden",
        }}
        isDark={true}
      />

      {/* Job Details Section */}
      <div className="job-details">
        <div className="tags-container">
          <div>
            {task?.categories?.length > 0 &&
            task?.categories[0]?.category?.parentCategory ? (
              <div
                className="skill-tag intermediate"
                style={{ pointerEvents: "none" }}
              >
                {task?.categories?.length > 0 &&
                  task?.categories[0]?.category?.parentCategory?.name}
              </div>
            ) : (
              ""
            )}
            {task?.categories?.map((cat: any, id: number) => (
              <div key={id}>
                <span
                  className="skill-tag fixed-price"
                  style={{ pointerEvents: "none" }}
                >
                  {cat?.category?.name}
                </span>
              </div>
            ))}
          </div>
          {/* <div className="skill-tag intermediate">
            <span>Intermediate</span>
          </div>
          <div className="skill-tag fixed-price">
            <span>{task?.amountType}</span>
          </div> */}
        </div>
        {/* Budget */}
        <div className="budget-section">
          <span className="budget-label">Est. Budget:</span>
          <h4 className="budget-amount">${task?.amount}</h4>
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
            <div className="online-dot"></div>
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
            Total tasks: {task?.expertsHired || 400}+
          </div>
          <div className="stat-item">
            Total Spent: ${task?.totalSpent || 100}K+
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCard;
