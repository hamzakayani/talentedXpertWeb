import { Alltasks1 } from '@/components/dashboardComponents/talentxpertEX/Alltasks1'
import { completedTasksMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import React from 'react'

type PageProps = {
  params: { userType: string; id: string }
}

export function generateMetadata({ params }: PageProps): Metadata {
  return completedTasksMetadata(params.userType, params.id)
}

const page = () => {
  return (
    <div>
      <Alltasks1 />
    </div>
  )
}

export default page
