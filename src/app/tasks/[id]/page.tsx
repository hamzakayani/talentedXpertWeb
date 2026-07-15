import ViewTasks from '@/components/dashboardComponents/viewTasks'
import { taskDetailMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import React from 'react'

type PageProps = {
  params: { id: string }
}

export function generateMetadata({ params }: PageProps): Metadata {
  return taskDetailMetadata(params.id)
}

const page = () => {
  return (
    <div>
        <ViewTasks/>
    </div>
  )
}

export default page
