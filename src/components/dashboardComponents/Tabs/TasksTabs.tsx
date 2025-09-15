import { TaskStatusTE, TaskStatusTR } from '@/services/enums/enums';
import React, { FC } from 'react'

interface TasksTabsProps {
    activeTab?: string;
    tabs: typeof TaskStatusTR | typeof TaskStatusTE;
    onClick: (tab:string) => void;
}

const TasksTabs:FC<TasksTabsProps> = ({ tabs, activeTab, onClick}) => {

    return (
        <>
            {/* Tabs */}
            <ul className="nav nav-pills filter-tabs">
                {Object.entries(tabs).map(([key, value]) => (
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
            </ul>
        </>
    )
}

export default TasksTabs