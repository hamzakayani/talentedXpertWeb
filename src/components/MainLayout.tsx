'use client'
import React, { FC, useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { store } from '@/store/Store'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { usePathname } from 'next/navigation'
import GlobalLoader from './common/GlobalLoader/GlobalLoader'

const MainLayout: FC<any> = ({ children }: any) => {
    const pathName = usePathname()
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            import('bootstrap/dist/js/bootstrap.bundle.min.js')
        }
    }, [])

    useEffect(() => {
        setIsLoading(true); // Show loader when route changes
        const timer = setTimeout(() => setIsLoading(false), 300); // Hide after 300ms

        return () => clearTimeout(timer);
    }, [pathName]);
    
    // useEffect(() => {
    //     const handleStart = () => {
    //         setIsLoading(true);
    //         setLoadingStartTime(Date.now());
    //     };

    //     const handleComplete = () => {
    //         if (loadingStartTime === null) return; 

    //         const timeSpent = Date.now() - loadingStartTime;
    //         const minDisplayTime = 500;
    //         const delayTime = Math.max(minDisplayTime - timeSpent, 0);

    //         setTimeout(() => {
    //             setIsLoading(false);
    //         }, delayTime);
    //     };

    //     handleStart();

    //     const timeoutId = setTimeout(handleComplete, 500);
    
    //     return () => clearTimeout(timeoutId);
    // }, [pathName]);

    return (
        <Provider store={store}>
            <PersistGate persistor={store.__PERSISTOR} loading={<GlobalLoader />}>
                {isLoading && <GlobalLoader />}
                <Header />
                {children}
                <Footer />
                <ToastContainer />
            </PersistGate>
        </Provider>
    )
}

export default MainLayout
