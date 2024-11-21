'use client'
import React, { FC, useEffect, useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import Hire from '@/components/common/Modals/Hire';
// import TextEditorQuill from '@/components/common/TextEditor/TextEditor';
import dynamic from 'next/dynamic';
import HtmlData from '@/components/common/HtmlData/HtmlData';
const QuillEditor = dynamic(() => import('@/components/common/TextEditor/TextEditor'), { ssr: false });


const Contract: FC<any> = ({ type }) => {
  const [editorTxt, setEditorTxt] = useState('');
  const [pop, setPop] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const [contracts, setContracts] = useState<any>({})
  // const [milestones, setMilestones] = useState<any>([])
  // const [totalAmount, setTotalAmount] = useState<Number>(0)
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const proposalId = searchParams.get('proposalId');
  const taskId = searchParams.get('taskId');
  const contractData = {
    proposalId: Number(proposalId),
    terms: editorTxt,
    totalAmount: 0,
    isTEApproved: false,
    isTRApproved: true,
  };

  


  const handleSubmit = () => {
    try {
      const response = apiCall(requests.makeContract, contractData, 'post', true, dispatch, user, router);
      console.log('resCON', response)
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }
  const getContract = async () => {
    await apiCall(requests.getContract, { taskId: Number(taskId) }, 'get', false, dispatch, user, router).then((res: any) => {
      setContracts(res?.data?.data || [])
      console.log('cont', res)
      

    }).catch(err => console.warn(err))

    console.log('cont', contracts)

  }
  useEffect(() => {
    getContract();

  }, [])
  

  

  // const editContract = () => {
  //   try {
  //     const response = apiCall(requests.editContract, {}, 'post', true, dispatch, user, router);
  //     console.log('resCON', response)
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //   }
  // }


  const handleMilestone = () => {
    setPop(true)
  }

  const handleEditorTxt = (value: any) => {
    setEditorTxt(value.replace(/<[^>]*>/g, '').trim() !== '' ? value : '')
  }



  return (
    <div>
      <div className='card'>
        <div className='viewtask-card card-header  px-4 bg-gray'>
          <div className='card-left-heading'>
            <h3>Contract</h3>
          </div>
        </div>
        {contracts? 
        
        <div className='card-bodyy viewtask'>
          <div className="mb-3 p-3 m-2">
          </div>

          <div className='px-3 m-5 mb-4 '>
          <HtmlData data={contracts.terms} className='text-white' />            
            <div className=' text-end'>
            </div>
          </div>

        </div>
        :(
          <div className='card-bodyy viewtask'>
          <div className="mb-3 p-3 m-2">
            <label className="form-label text-light fs-12">Description :</label>
            <QuillEditor className="form-control text-white  invert border-0" style={{ height: '250px' }} placeholder="Write your description here..." value={editorTxt} setValue={handleEditorTxt} />
          </div>

          <div className='px-3 m-5 mb-4 '>
            <div className=''>
              {/* <button className="btn rounded-pill btn-outline-info mx-1 my-1" data-bs-target="#exampleHiredProposal" data-bs-toggle="modal" onClick={handleMilestone}>Create Milestones</button> */}

            </div>

            <div className=' text-end'>
              <button type="submit" className="btn btn-info btn-sm rounded-pill" onClick={handleSubmit}>Submit</button>
            </div>
          </div>

        </div>
          
        )}
      </div>
      {/* {(<Hire isOpen={pop} onClose={() => setPop(false)} milestone={milestones} setMilestones={setMilestones} setTotalAmount={setTotalAmount} totalAmount={totalAmount} />)} */}

    </div>
  )
}

export default Contract