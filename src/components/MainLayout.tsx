'use client'
import React, { FC, useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { store } from '@/store/Store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation'

const MainLayout: FC<any> = ({ children }: any) => {
    const router = useRouter();
    const pathName = usePathname()
    const [access, setAccess] = useState<string | null>(null);
    // const access = typeof document !== 'undefined' && localStorage.getItem('access')

    useEffect(() => {
        if (typeof document !== 'undefined') {
            import('bootstrap/dist/js/bootstrap.bundle.min.js')
            const storedAccess:any = localStorage.getItem('access') || null;
            setAccess(storedAccess);
        }
    }, [])

    useEffect(() => {
        // if (access === null) return;
        if (pathName?.includes("/dashboard") && !access) {
            router.push("/signin");
        }
    }, [router, pathName, access]);

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
