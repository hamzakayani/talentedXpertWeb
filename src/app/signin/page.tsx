import SignIn from '@/components/log-in/Signin'
import MainLayout from '@/components/MainLayout'
import React from 'react'

const page = () => {
  return (
    <div>
      <MainLayout>
        <SignIn/>
      </MainLayout>
    </div>
  )
}

export default page
