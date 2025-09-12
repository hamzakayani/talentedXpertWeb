import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const NewCard: React.FC = () => {
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
          <span className="posted-time">Posted 3 hours ago</span>
        </div>
        {/* Bookmark Icon */}
        <div className="bookmark-icon">
          <Icon icon="solar:bookmark-outline" />
        </div>
      </div>

      {/* Job Title */}
      <h3 className="job-title">
        Mystery Shopper Needed for Educational Service Monitoring in United Kingdom
      </h3>

      {/* Job Description */}
      <p className="job-description">
        Hello, We are a professional educational service monitoring company that conducts evaluations to help schools, training...
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
            <span>Fixed Price</span>
          </div>
        </div>
        {/* Budget */}
        <div className="budget-section">
          <span className="budget-label">Est. Budget:</span>
          <span className="budget-amount">$70</span>
        </div>
      </div>

      {/* Divider */}
      <div className="divider"></div>

      {/* Requester Information */}
      <div className="requester-info">
        <div className="requester-left">
          {/* Company Name with Online Status */}
          <div className="company-info">
            <span className="company-name">TechCorp Inc.</span>
            <div className="online-dot"></div>
          </div>
          {/* Rating */}
          <div className="rating-text">4/5 Requestor Rating</div>
          {/* Star Rating */}
          <div className="star-rating">
            {[...Array(4)].map((_, i) => (
              <Icon key={i} icon="solar:star-bold" className="star-filled" />
            ))}
            <Icon icon="solar:star-outline" className="star-outline" />
          </div>
        </div>
        
        {/* Right Side Stats */}
        <div className="requester-stats">
          <div className="stat-item">Xperts Hired: 400+</div>
          <div className="stat-item">Total Spent: $100K+</div>
        </div>
      </div>
    </div>
  );
};

export default NewCard;
