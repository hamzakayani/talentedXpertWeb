'use client'
import React, { FC } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Toaster } from 'react-hot-toast'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { store } from '@/store/Store'
const MainLayout:FC<any> = ({children}:any) => {
    return (
        <>
        <Provider store={store}>
          <PersistGate persistor={store.__PERSISTOR} loading={null}>
            <Toaster position="bottom-center" />
            <Header />
            {children}
            <Footer />
            </PersistGate>
        </Provider>
        </>
    )
}

export default MainLayout
