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


const Contract: FC<any> = () => {
  const [editorTxt, setEditorTxt] = useState('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [contractDecesion, setContractDecesion] = useState<boolean>(false);
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
    terms: editorTxt ? editorTxt : contracts.terms,
    totalAmount: 0,
    isTEApproved: contractDecesion ? true : false,
    isTRApproved: true,
  };




  const handleSubmit = () => {
    try {
      const response = apiCall(editMode?requests.editContract + contracts.id :requests.makeContract, contractData, `${editMode?'put':'post' }`, true, dispatch, user, router);
      console.log('resCON', response)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  const getContract = async () => {
    await apiCall(requests.getContract, { taskId: Number(taskId) }, 'get', false, dispatch, user, router).then((res: any) => {
      setContracts(res?.data?.data || [])
      if(res?.data?.data?.id){
        setEditMode(true)
        setEditorTxt(res?.data?.data?.terms) 
      }
    }).catch(err => console.warn(err))
  }

  const updateContract = async (id: number, decision: boolean) => {
    const formData = {
      ...contractData,
      isTEApproved: decision,
    }
    await apiCall(requests.editContract + id, formData, 'put', false, dispatch, user, router).then((res: any) => {
      setContracts(res?.data?.data || [])
      router.push('/dashboard')
    }).catch(err => console.warn(err))
  }

  useEffect(() => {
    getContract();
    
  }, [])

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
        {user?.profile[0]?.type === 'TE' ?

          <div className='card-bodyy viewtask'>
            <div className='m-5 mb-4 '>
              <HtmlData data={contracts.terms} className='text-white' />

            </div>
            <div className='text-end mb-3'>
              <button className="btn rounded-pill btn-outline-info mx-1 my-1" onClick={() => {
                updateContract(contracts.id, true)

              }}> Accept</button>
              <button className="btn rounded-pill btn-outline-info mx-1 my-1" onClick={() => {
                updateContract(contracts.id, false)
              }}>Reject</button>
            </div>
          </div>
          : (
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
                  <button type="submit" className="btn btn-info btn-sm rounded-pill" onClick={handleSubmit} >Submit</button>
                </div>
              </div>

            </div>

          )}
      </div>

    </div>
  )
}

export default Contract