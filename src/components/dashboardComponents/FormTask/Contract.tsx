import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';

const Contract = () => {
  return (
    <div>
        <div className='card'>
                <div className='viewtask-card card-header  px-4 bg-gray'>
                    <div className='card-left-heading'>
                        <h3>Contract</h3>
                    </div>
                </div>
                <div className='card-bodyy viewtask'>
                <div className="mb-3 p-3 m-2">
                                        <label className="form-label text-light fs-12">Description :</label>
                                        <textarea className="form-control bg-gray text-light border-0" id="exampleFormControlTextarea" rows={6}></textarea>
                                    </div>  

<div className='px-3 m-2 mb-4'>
<div className=''>
<button className="btn rounded-pill btn-outline-info mx-1 my-1 btn-sm ">Create Millstone</button>
</div>

<div className=' text-end'>
                            <button type="submit" className="btn btn-info btn-sm rounded-pill">Submit</button>
                        </div>
                        </div>

                </div>
            </div>
    </div>
  )
}

export default Contract