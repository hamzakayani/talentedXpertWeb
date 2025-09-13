"use client"
import React, { FC, useState } from 'react'
import Sidebar, { TabKey } from '../common/Sidebar/Sidebar';

const DashboardLayout:FC<any> = ({ children}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
    return (
        <div className="app-shell">
            <Sidebar active={activeTab} onChange={setActiveTab} />
            <main className="main-area">
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout