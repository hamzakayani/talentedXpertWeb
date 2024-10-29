import { TaskStatus } from '@/services/enums/enums'
import { RootState } from '@/store/Store'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'

const TopMenu = () => {
    const user = useSelector((state: RootState) => state.user)
    return (

        <div className='mx-3 d-lg-flex justify-content-between'>
            <ul className="nav nav-pills mt-3" id="pills-tab" role="tablist">
                {Object.keys(TaskStatus).map(key => {
                    const value = TaskStatus[key as keyof typeof TaskStatus];
                    return (
                        <li className="nav-item" role="presentation" key={value}>
                            <button className="nav-link" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">{value}</button>
                        </li>
                    );
                })}
            </ul>
            {user?.profile[0]?.type === 'TR' && <Link href='/dashboard/tasks/add-task'><div className='card-right-heading bg-info text-white  d-flex justify-content-between ad-new' >
                <span className='me-3'>Add New Task</span>
                <Icon icon="line-md:plus-square-filled" className='text-dark' width={32} height={32} />
            </div></Link>}
        </div>

    )
}

export default TopMenu