import Sidebar from '@/components/dashboardComponents/sidebar/sidebar'
import MainLayout from '@/components/MainLayout'
import React, { FC } from 'react'

const layout:FC<any> = ({ children }) => {
    return (
        <MainLayout>
            <section className='container-fluid'>
                <div className='row'>
                    <Sidebar />
                    {children}
                </div>
            </section>        
        </MainLayout>
    )
}

export default layout
