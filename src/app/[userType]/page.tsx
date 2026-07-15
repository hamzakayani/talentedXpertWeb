import Talentedxperts from '@/components/talentedxperts/Talentedxperts'
import { userTypeListingMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import React from 'react'

type PageProps = {
  params: { userType: string }
}

export function generateMetadata({ params }: PageProps): Metadata {
  return userTypeListingMetadata(params.userType)
}

const page = () => {
    return (
        <div>
            <Talentedxperts isDashboard={false} />
        </div>
    )
}

export default page
