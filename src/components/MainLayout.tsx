'use client'
import React, { FC, useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { store } from '@/store/Store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from 'next/navigation'
import GlobalLoader from './common/GlobalLoader/GlobalLoader'

const MainLayout: FC<any> = ({ children }: any) => {
    const pathName = usePathname()
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            import('bootstrap/dist/js/bootstrap.bundle.min.js')
        }
    }, [])

    useEffect(() => {
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 200);

        return () => clearTimeout(timer);
    }, [pathName]);

    return (
        <>
            {
                <Provider store={store}>
                    <PersistGate persistor={store.__PERSISTOR} loading={<GlobalLoader />}>
                        {isLoading && <GlobalLoader />}
                        <Header />
                        {children}
                        <Footer />
                        <ToastContainer />
                    </PersistGate>
                </Provider>
            }
        </>
    )
}

export default MainLayout
