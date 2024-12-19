'use client'
import React, { FC, useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { RootState, store } from '@/store/Store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation'
import GlobalLoader from './common/GlobalLoader/GlobalLoader'
import EventEmitter from 'events'

const eventEmitter = new EventEmitter();

const MainLayout: FC<any> = ({ children }: any) => {
    const router = useRouter();
    const pathName = usePathname()
    const [accesss, setAccess] = useState<string | null>(null);
    const access = typeof document !== 'undefined' && localStorage.getItem('access')
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            import('bootstrap/dist/js/bootstrap.bundle.min.js')
            const storedAccess: any = localStorage.getItem('access') || null;
            setAccess(storedAccess);
        }
    }, [])

    useEffect(() => {
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

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
