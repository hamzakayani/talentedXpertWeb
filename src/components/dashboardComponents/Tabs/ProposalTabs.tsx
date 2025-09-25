import { ProposalStatus } from '@/services/enums/enums';
import React, { FC } from 'react'

interface ProposalTabsProps {
    activeTab?: string;
    onClick: (tab:string) => void;
}

const ProposalTabs:FC<ProposalTabsProps> = ({ activeTab, onClick }) => {
    activeTab = activeTab || ''

    return (
        <div className={``}>
            {/* Tabs */}
            <ul className="nav nav-pills filter-tabs">
                {Object.entries(ProposalStatus).map(([key, value]) => (
                    <li className='nav-item' key={key}>
                        <button
                            type="button"
                            className={`nav-link ${key === activeTab ? "active" : ""}`}
                            onClick={() => onClick(key)}
                        >
                            {value}
                        </button>
                    </li>
                ))}
                <li className='nav-item'>
                    <button
                        type="button"
                        className={`nav-link ${'AI Recommendation' === activeTab ? "active" : ""}`}
                        onClick={() => onClick('AI Recommendation')}
                    >
                        AI Recommendation
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default ProposalTabs