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
    const [accesss, setAccess] = useState<string | null>(null);
    // const [shouldDisplay,setShouldDisplay] = useState(false)
    const access = typeof document !== 'undefined' && localStorage.getItem('access')
    useEffect(() => {
        // if(localStorage.getItem('access') || pathName?.includes("/signin")){
        //     setShouldDisplay(true)
        // }
        // if (accesss === null) return;
        if (pathName?.includes("/dashboard") && (!localStorage.getItem('access'))) {
            router.push("/signin");
        }
    }, [router, pathName]);
    
    useEffect(() => {
        if (typeof document !== 'undefined') {
            import('bootstrap/dist/js/bootstrap.bundle.min.js')
            const storedAccess:any = localStorage.getItem('access') || null;
            setAccess(storedAccess);
        }
    }, [])

    // useEffect(() => {
    //     // if(localStorage.getItem('access') == null){
    //     //     setShouldDisplay(false)
    //     // }
    //     // if (accesss === null) return;
    //     if (pathName?.includes("/dashboard") && (!localStorage.getItem('access'))) {
    //         router.push("/signin");
    //     }
    // }, [router, pathName]);

  

    return (
        <>
        {
            // shouldDisplay &&
            <Provider store={store}>
                <PersistGate persistor={store.__PERSISTOR} loading={null}>
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
