'use client'
import React, { FC, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { store } from '@/store/Store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout: FC<any> = ({ children }: any) => {

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
