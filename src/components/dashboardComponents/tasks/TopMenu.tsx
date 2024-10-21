import { RootState } from '@/store/Store'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'

const TopMenu = () => {
    const user = useSelector((state: RootState) => state.user)
    return (

      <div className='mx-4 d-flex justify-content-between'>
          <ul className="nav nav-pills mt-3" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
                <button className="nav-link active " id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">All</button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">In Progress</button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Posted</button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Completed</button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Closed</button>
            </li>
           

        </ul>
        {user?.profile[0]?.type === 'TR' && <Link href='/dashboard/tasks/add-task'><div className='card-right-heading bg-info text-white  d-flex justify-content-between' >
                    <span className='me-3'>Add New Task</span>
                    <Icon icon="line-md:plus-square-filled" className='text-dark' width={32} height={32} />
                </div></Link>}
      
      
        </div>
        
    )
}

export default TopMenu