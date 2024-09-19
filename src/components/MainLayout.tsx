import React, { FC } from 'react'
import Header from './Header'
import Footer from './Footer'
const MainLayout:FC<any> = ({children}:any) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default MainLayout
