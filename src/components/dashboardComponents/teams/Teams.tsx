'use client'
import Link from 'next/link'
import { Icon } from '@iconify/react';
import React from 'react'
import FilterCard from './FilterCard';
import TeamTable from './TeamTable';
import { Pagination } from '@/components/common/Pagination/Pagination';

const Teams = () => {
    return (
        <section className=''>
            <div className='card'>
                <div className="card-header bg-dark text-light d-flex flex-wrap align-items-center justify-content-between">
                    <h5 className='mb-0 me-5'>My Teams</h5>
                    <Link href='/dashboard/teams/add'>
                        <div className='card-right-heading d-flex justify-content-between bg-info dispute-btn card-right-heading bg-info text-white  d-flex justify-content-between add-new '>
                            <span className=''>Add New Team </span>
                            <Icon icon="line-md:plus-square-filled" className='text-black' width={32} height={32} />
                        </div>
                    </Link>
                </div>
                <div className="card-body bg-gray">
                    <FilterCard />
                    <TeamTable />
                    {/* {users?.count > 0 && <Pagination count={users?.count} page={page} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} siblingCount={1} />} */}
                </div>
            </div>
        </section>
    )
}

export default Teams