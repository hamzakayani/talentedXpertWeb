'use client'
import React, { FC, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider, UseSelector } from 'react-redux'
import { RootState, store } from '@/store/Store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux'
import { usePathname, useRouter } from 'next/navigation'

const MainLayout: FC<any> = ({ children }: any) => {
    const router = useRouter();
    const pathName = usePathname()
    const access = typeof document !== 'undefined' && localStorage.getItem('access')
    // useEffect(() => {
    //     if (pathName?.includes("/dashboard") && !access) {
    //         router.push("/signin");
    //     }
    // }, [router, pathName ,access]);


    useEffect(() => {
        if (typeof document !== 'undefined') {
            import('bootstrap/dist/js/bootstrap.bundle.min.js')
        }
    }, [])

    return (
        <>
            <Provider store={store}>
                <PersistGate persistor={store.__PERSISTOR} loading={null}>
                    <Header />
                    {children}
                    <Footer />
                    <ToastContainer />
                </PersistGate>
            </Provider>
        </>
    )
}

export default MainLayout
