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


                    <Link href='/dashboard/articles/add'>
                        <div className='card-right-heading d-flex justify-content-between bg-info dispute-btn card-right-heading bg-info text-white  d-flex justify-content-between add-new ' data-bs-target="#exampleModalToggle11" data-bs-toggle="modal">
                            <span className=''>Add New Article </span>
                            <Icon icon="line-md:plus-square-filled" className='text-black' width={32} height={32} />
                        </div>
                    </Link>

                </div>
                <div className="card-body bg-gray">
                    <ListCards type={'big'} />
                </div>
            </div>
        </section>
    )
}
