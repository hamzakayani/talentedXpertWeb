import React, { FC } from 'react'
import { Icon } from '@iconify/react';
import HtmlData from '../HtmlData/HtmlData'

interface DasboardCardProps { 
    tag?: string,
    postedDate?: string,
    title?: string,
    description?: string,
    categories?: any[],
    amount?: number | string,
    rating?: number | null,
    totalTasks?: number | null,
    totalSpent?: number | null,
    isDivider?: boolean,
    username?: string,
    isOnline?: boolean,
    children?:any
}

const DashboardCard:FC<DasboardCardProps> = ({ tag, postedDate, title, description, categories, amount, rating, totalTasks, totalSpent, isDivider, username, isOnline, children}) => {
    return (
        <div className="new-card">
            {/* Top Section */}
            <div className="card-header">
                {/* Urgent Tag */}
                <div className="urgent-tag">
                    <span className="urgent-text">{tag}</span>
                </div>
                {/* Posted Time */}
                <span className="posted-time">Posted {postedDate}</span>
            </div>

            {/* Job Title */}
            <h3 className="job-title">
                {title}
            </h3>

            {/* Job Description */}
            <HtmlData data={description} className="job-description" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 4, overflow: "hidden" }} isDark={true} />

            {/* Job Details Section */}
            <div className="job-details">
                <div className="tags-container">
                    <div className="skill-tag intermediate">
                        <span>Intermediate</span>
                    </div>
                    {/* <div className="skill-tag fixed-price">
                        <span>0</span>
                    </div>  */}
                </div>

                {/* Budget */}
                <div className="budget-section">
                    <span className="budget-label">Est. Budget:</span>
                    <span className="budget-amount">${amount}</span>
                </div>
            </div>

            {/* Divider */}
            {isDivider && <div className="divider"></div>}

            {/* Requestor Information */}
            <div className="requester-info">
                <div className="requester-left">
                    {/* Company Name with Online Status */}
                    <div className="company-info">
                        <span className="company-name">{username}</span>
                        {/* {isOnline && 
                            <div className="online-dot"></div>
                        } */}
                    </div>

                    {/* Rating */}
                    {rating && 
                        <>
                            <div className='rating-text'>
                                {rating} / 5 Rating
                            </div>
                            <div className='star-rating'>
                                {[...Array(5)].map((_,idx) => (
                                    <Icon 
                                        key={idx} 
                                        icon={`solar:star-${idx < rating ? 'bold' : 'outline'}`} 
                                        className={idx < rating ? "star-filled" : "star-outline"} 
                                    />
                                ))}
                            </div>
                        </>
                    }
                </div>

                {/* Right Side Stats */}
                <div className="requester-stats">
                    {totalTasks && 
                        <div className="stat-item">Total tasks: {totalTasks}+</div>
                    }
                    {totalSpent && 
                        <div className="stat-item">Total Spent: ${totalSpent}</div>
                    }
                </div>
            </div>

            {children}
        </div>
    )
}

export default DashboardCard