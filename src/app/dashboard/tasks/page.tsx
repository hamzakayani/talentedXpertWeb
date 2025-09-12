import React from 'react'
import Tasks from '@/components/dashboardComponents/tasks';
import NewCard from '@/components/common/cards/newCard';

const page = () => {
    return (
        <div>
            <Tasks isactive={false} topMenu={true}  />
            {/* <NewCard/> */}
        </div>
    )
}

export default page