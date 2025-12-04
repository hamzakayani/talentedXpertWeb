'use client'
import React, { FC, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import dynamic from 'next/dynamic'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { store } from '@/store/Store'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GlobalLoader from './common/GlobalLoader/GlobalLoader'
import { usePathname } from 'next/navigation'
import { setAxiosHeaders } from '@/services/axiosDefaults'
const CallHandler = dynamic(() => import('./video-call/CallHandler'), { ssr: false }) // for audio video calling

const MainLayout: FC<any> = ({ children }: any) => {
    const pathname = usePathname();
    setAxiosHeaders();

    useEffect(() => {
        const loadBootstrap = async () => {
            if (typeof window !== 'undefined' && typeof document !== 'undefined') {
                const bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min.js');
                // Optional: store bootstrap globally for convenience
                (window as any).bootstrap = bootstrap;
                console.log('Bootstrap JS loaded');
            }
        };

        loadBootstrap();
    }, []);

    return (
        <Provider store={store}>
            <PersistGate persistor={store.__PERSISTOR} loading={<GlobalLoader />}>
                {pathname?.includes('/meeting') ?
                    children :
                    pathname?.includes('/dashboard') ?
                       children : 
                        <>
                            <Header />
                            {children}
                            <Footer />
                        </>
                }
                <CallHandler /> 
                <ToastContainer />
            </PersistGate>
        </Provider>
    )
}

export default MainLayout
