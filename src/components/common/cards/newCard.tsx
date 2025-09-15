import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface NewCardProps {
  task?: any;
}

const NewCard: React.FC<NewCardProps> = ({ task }) => {
  console.log('task', task);
  return (
    <div className="new-card">
      {/* Top Section */}
      <div className="card-header">
        <div className="header-left">
          {/* Urgent Tag */}
          <div className="urgent-tag">
            <span className="urgent-text">Urgent</span>
          </div>
          {/* Posted Time */}
          <span className="posted-time">Posted {task?.createdAt ? new Date(task.createdAt).toLocaleDateString() : ""}</span>
        </div>
        {/* Bookmark Icon */}
        <div className="bookmark-icon">
          <Icon icon="solar:bookmark-outline" />
        </div>
      </div>

      {/* Job Title */}
      <h3 className="job-title">
        {task?.name}
      </h3>

      {/* Job Description */}
      <p className="job-description" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 4, overflow: "hidden" }}>
        {task?.details}
      </p>

      {/* Job Details Section */}
      <div className="job-details">
        <div className="tags-container">
          {/* Intermediate Tag */}
          <div className="skill-tag intermediate">
            <span>Intermediate</span>
          </div>
          {/* Fixed Price Tag */}
          <div className="skill-tag fixed-price">
            <span>{task?.amountType}</span>
          </div>
        </div>
        {/* Budget */}
        <div className="budget-section">
          <span className="budget-label">Est. Budget:</span>
          <span className="budget-amount">${task?.amount}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="divider"></div>

      {/* Requester Information */}
      <div className="requester-info">
        <div className="requester-left">
          {/* Company Name with Online Status */}
          <div className="company-info">
            <span className="company-name">{task?.companyName }</span>
            <div className="online-dot"></div>
          </div>
          {/* Rating */}
          <div className="rating-text">{task?.rating || 4}/5 Requestor Rating</div>
          {/* Star Rating */}
          <div className="star-rating">
            {[...Array(Math.floor(task?.rating || 4))].map((_, i) => (
              <Icon key={i} icon="solar:star-bold" className="star-filled" />
            ))}
            {[...Array(5 - Math.floor(task?.rating || 4))].map((_, i) => (
              <Icon key={i} icon="solar:star-outline" className="star-outline" />
            ))}
          </div>
        </div>
        
        {/* Right Side Stats */}
        <div className="requester-stats">
          <div className="stat-item">Xperts Hired: {task?.expertsHired || 400}+</div>
          <div className="stat-item">Total Spent: ${task?.totalSpent || 100}K+</div>
        </div>
      </div>
    </div>
  );
};

export default NewCard;
