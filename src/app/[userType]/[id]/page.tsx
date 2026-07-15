import ViewProfile from '@/components/dashboardComponents/viewProfile/viewProfile'
import { userProfileMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import React from 'react'

type PageProps = {
  params: { userType: string; id: string }
}

export function generateMetadata({ params }: PageProps): Metadata {
  return userProfileMetadata(params.userType, params.id)
}

const page = () => {
  return (
    <div>
      <ViewProfile isDashboard={false} />
    </div>
  )
}

export default page
