'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useRouter, useSearchParams } from 'next/navigation';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import Hire from '@/components/common/Modals/Hire';
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


const Contract = () => {
  const [description, setDescription] = useState<any>('');
  const [pop, setPop] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
    const [messageLimit, setMessageLimit] = useState<number>(10);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const proposalId = searchParams.get('proposalId');

    
    
  const handleDescriptionChange = (value:any) => {
    setDescription(value);
  };

  const handleSubmit = () =>{
    try {
      const response =  apiCall(requests.getMsg, {} , 'post', true, dispatch, user, router);
      console.log('res', response)
  } catch (error) {
      console.error('Error fetching messages:', error);
  }
    
  }
  const handleMilestone = () => {
    setPop(true)
  }

 

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
            <ReactQuill
              value={description}
              onChange={handleDescriptionChange}
              className="bg-gray text-light border-0"
              style={{ height: '250px' }} 
              theme="snow"
              placeholder="Write your description here..."
            />
          </div>

          <div className='px-3 m-5 mb-4 '>
            <div className=''>
            <button className="btn rounded-pill btn-outline-info mx-1 my-1" data-bs-target="#exampleHiredProposal" data-bs-toggle="modal"  onClick={handleMilestone}>Create Milestones</button>

            </div>

            <div className=' text-end'>
              <button type="submit" className="btn btn-info btn-sm rounded-pill" onClick={handleSubmit}>Submit</button>
            </div>
          </div>

        </div>
      </div>
      {pop && <Hire isOpen={pop} onClose={() => setPop(false)} />}

    </div>
  )
}

export default Contract