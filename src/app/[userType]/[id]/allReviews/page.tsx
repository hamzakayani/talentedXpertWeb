import AllUserReviews from '@/components/dashboardComponents/AllUserReviews/AllUserReviews';
import { userReviewsMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import React from 'react'

type PageProps = {
  params: { userType: string; id: string }
}

export function generateMetadata({ params }: PageProps): Metadata {
  return userReviewsMetadata(params.userType, params.id)
}

const page = () => {
  return (
    <div>
      <AllUserReviews />
    </div>
  )
};
export default page;
