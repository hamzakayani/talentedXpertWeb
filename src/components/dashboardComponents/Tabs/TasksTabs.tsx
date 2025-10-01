'use client'
import { useNavigation } from '@/hooks/useNavigation';
import { TaskStatusTE, TaskStatusTR } from '@/services/enums/enums';
import Link from 'next/link';
import React, { FC } from 'react'
import { Icon } from '@iconify/react';

interface TasksTabsProps {
    activeTab?: string;
    tabs: typeof TaskStatusTR | typeof TaskStatusTE;
    onClick: (tab:string) => void;
    isBtn: boolean;
}

const TasksTabs:FC<TasksTabsProps> = ({ tabs, activeTab, onClick, isBtn}) => {
    const { navigate } = useNavigation()

    activeTab = activeTab || Object.keys(tabs)[0]

    return (
        <div className={`${isBtn ? 'd-flex justify-content-between flex-wrap': ''}`}>
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
            {isBtn && 
                <Link
                    href='/dashboard/tasks/add'
                    onClick={() => navigate('/dashboard/tasks/add')}
                    className="btn rounded-pill d-inline-flex align-items-center gap-2 py-2 px-3 shadow-sm mt-md-0 mt-sm-3 border-0"
                    style={{
                        background: "linear-gradient(135deg, #D7E2FF 0%, #AFEEFF 100%)",
                        color: "#333",
                    }}
                >
                    <Icon icon="line-md:plus" width={18} height={18} />
                    Add New Task
                </Link>
            }
        </div>
    )
}

export default TasksTabs