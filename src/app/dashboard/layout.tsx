import DashboardLayout from '@/components/dashboardLayout/DashboardLayout';
import { noIndexMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import React, { FC } from 'react'

export const metadata: Metadata = noIndexMetadata;

const layout: FC<any> = ({ children }) => {

    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}

export default layout
