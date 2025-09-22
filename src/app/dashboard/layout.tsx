import DashboardLayout from '@/components/dashboardLayout/DashboardLayout';
import React, { FC } from 'react'

const layout: FC<any> = ({ children }) => {

    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}

export default layout
