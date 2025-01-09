'use client'
import React from 'react'
import { Icon } from '@iconify/react';
import ListCards from '../Articles/ListCards'
import Link from 'next/link'


export const Articlelist = () => {

    return (
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light d-flex flex-wrap align-items-center justify-content-between">
                    <h5 className='mb-0 me-5'>My Articles</h5>
                    <Link href='/dashboard/articles/add'><div className='d-flex align-items-center' >
                        <h5 className='mb-0 me-3 text-light'>Add New Article</h5>
                        <Icon icon="line-md:plus-square-filled" className='text-info' width={32} height={32} />
                    </div></Link>
                </div>
                <div className="card-body bg-gray">
                    <ListCards type={'big'} />
                </div>
            </div>
        </section>
    )
}
