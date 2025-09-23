import React from 'react'
import Tasks from '@/components/dashboardComponents/tasks';

const page = () => {
    return (
        <Tasks isactive={false} topMenu={true} isDashboard={true}  />
    )
}

export default page