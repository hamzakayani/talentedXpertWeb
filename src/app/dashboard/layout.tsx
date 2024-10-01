import Sidebar from '@/components/dashboardComponents/sidebar/sidebar'
import MainLayout from '@/components/MainLayout'
import React, { FC } from 'react'

const layout: FC<any> = ({ children }) => {
    return (
        <MainLayout>
            <section className='container-fluid'>
                <div className='row'>
                    <Sidebar />
                    <div className='col-lg-10 col-md-9'>
                        <div className='right-side-layout'>
                            {children}
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}

export default layout
