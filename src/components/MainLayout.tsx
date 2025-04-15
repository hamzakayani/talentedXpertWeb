'use client'
import React, { FC, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { RootState, store } from '@/store/Store'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GlobalLoader from './common/GlobalLoader/GlobalLoader'
import CallHandler from './video-call/CallHandler'

const MainLayout: FC<any> = ({ children }: any) => {

    useEffect(() => {
        if (typeof self !== 'undefined' && typeof document !== 'undefined') {
            import('bootstrap/dist/js/bootstrap.bundle.min.js')
        }
    }, [])

    return (
        <Provider store={store}>
            <PersistGate persistor={store.__PERSISTOR} loading={<GlobalLoader />}>
                <Header />
                {children}
                <Footer />
                <CallHandler />
                <ToastContainer />
            </PersistGate>
        </Provider>
    )
}

export default MainLayout
