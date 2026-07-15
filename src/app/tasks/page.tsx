import Tasks from '@/components/dashboardComponents/tasks'
import { pageMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = pageMetadata('/tasks')

const page = () => {
  return (
    <Tasks isactive={false} auth={true} topMenu={false} isDashboard={false} />
  )
}

export default page
