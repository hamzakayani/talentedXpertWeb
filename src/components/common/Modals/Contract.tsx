'use client'
import React, { FC, useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import dynamic from 'next/dynamic';
import HtmlData from '@/components/common/HtmlData/HtmlData';
import MsgNotifier from '@/components/common/MsgNotifier/MsgNotifier';
import { toast } from 'react-toastify';
import contract from '@/components/contract/contract';
const QuillEditor = dynamic(() => import('@/components/common/TextEditor/TextEditor'), { ssr: false });

const Contract = ({proposalId, taskId, taskStatus}:any) => {
    const [editorTxt, setEditorTxt] = useState('');
    const [editMode, setEditMode] = useState<boolean>(false);
    const [msgNotify, setMsgNotify] = useState<boolean>(false);
    const [buttonsShow, setButtonsShow] = useState<boolean>(false);
    const [contractDecesion, setContractDecesion] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state.user);
    const [proposal, setProposal] = useState<any>({})
    const [contracts, setContracts] = useState<any>({})
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    // const proposalId = searchParams.get('proposalId');
    // const taskId = searchParams.get('taskId');
    const contractData = {
        proposalId: Number(proposalId),
        terms: editorTxt ? editorTxt : contracts.terms,
        totalAmount: 0,
        isTEApproved: contractDecesion ? true : false,
        isTRApproved: true,
    };
    console.log('id',proposalId,taskId )

    const getProposals = async () => {
        try {
            const response = await apiCall(requests.getProposals, { id: Number(proposalId) }, 'get', false, dispatch, user, router);
            setProposal(response?.data?.data?.proposals[0] || {});
        } catch (error) {
            console.warn("Error fetching tasks:", error);
        }
    }

    const handleSubmit = () => {
        if (!editorTxt.trim()) {
            toast.error("Description cannot be empty.");
            return;
        }
        try {
            const response = apiCall(editMode ? requests.editContract + contracts.id : requests.makeContract, contractData, `${editMode ? 'put' : 'post'}`, true, dispatch, user, router);
            if (!editMode) {
                setMsgNotify(true)
            }

        } catch (error) {
            console.error('Error fetching messages:', error);
        }

        router.push(`/dashboard/tasks/${taskId}`)
    }

    const getContract = async () => {
        console.log('tt')
        await apiCall(requests.getContract, { proposalId: Number(proposalId) }, 'get', false, dispatch, user, router).then((res: any) => {
            console.log('res',res.data.data.contracts[0])
            setButtonsShow(res.data.data.contracts[0].isTEApproved ? false : true);
            setContracts(res?.data?.data?.contracts[0] || [])
            if (res?.data?.data?.contracts[0]?.id) {
                if(res?.data?.data?.contracts[0]?.status!== 'COMPLETED' && res?.data?.data?.contracts[0]?.status!== 'INPROGRESS' ){

                    setEditMode(true)
                }
                setEditorTxt(res?.data?.data?.contracts[0]?.terms)
            }
        }).catch(err => console.warn(err))
    }
console.log('contt', contracts)
    const updateContract = async (id: number, decision: boolean) => {
        const formData = {
            ...contractData,
            isTEApproved: decision,
        }
        await apiCall(requests.editContract + id, formData, 'put', false, dispatch, user, router).then((res: any) => {
            setContracts(res?.data?.data || [])
            router.push(`/dashboard/tasks/${taskId}`)
        }).catch(err => console.warn(err))
    }

    useEffect(() => {
        if(proposalId){

            getContract();
        }
        getProposals();
    }, [proposalId])

    useEffect(() => {
        
        getProposals();
    }, [])

    const handleEditorTxt = (value: any) => {
        setEditorTxt(value.replace(/<[^>]*>/g, '').trim() !== '' ? value : '')
    }

    return (
        <div className='ad-dispute'>
            <div className="modal fade" id="exampleModalToggle78" aria-hidden="true" aria-labelledby="exampleModalToggleLabel78" tabIndex={1}>
                <div className="modal-dialog  modal-dialog-centered   ">

                    <div className="modal-content modal-content-center">

                        <div className="modal-header">
                            <h5 className="modal-title text-white" id="exampleModalToggleLabel78">Contract</h5>
                            <button type="button" className="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='card'>
                                <div className='viewtask-card card-header  px-4 bg-gray'>
                                </div>
                                {user?.profile?.length > 0 && user?.profile[0]?.type === 'TE' ? (
                                <div className="card-body viewtask">
                                    <div className="m-5 mb-4">
                                        <HtmlData data={contracts.terms} className="text-white" />
                                    </div>
                                    {buttonsShow && (
                                        <div className="text-end mb-3">
                                            <button
                                                className="btn rounded-pill btn-outline-info mx-1 my-1"
                                                data-bs-dismiss="modal" aria-label="Close" onClick={() => updateContract(contracts.id, true)}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="btn rounded-pill btn-outline-info mx-1 my-1"
                                                data-bs-dismiss="modal" aria-label="Close" onClick={() => updateContract(contracts.id, false)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Contract View for 'TR'
                                <div className="card-body viewtask">
                                    <div className="mb-3 p-3 m-2">
                                        <label className="form-label text-light fs-12">Description:</label>
                                        <QuillEditor
                                            className="form-control text-white invert border-0"
                                            style={{ height: '250px' }}
                                            placeholder="Write your description here..."
                                            value={editorTxt}
                                            setValue={handleEditorTxt}
                                        />
                                    </div>

                                    <div className="text-end px-3 m-5 mb-4">
                                       
                                    </div>
                                </div>
                            )}
                            </div>





                        </div>
                        <div className="modal-footer">
                            <div className="d-grid gap-2">

                            </div>
                            {user?.profile[0]?.type === 'TR' && taskStatus !=='COMPLETED' && taskStatus!='INPROGRESS' &&<button type="submit" className="btn btn-info btn-sm rounded-pill"  data-bs-dismiss="modal" aria-label="Close" onClick={handleSubmit} >Submit</button>}
                            </div>
                    </div>

                </div>
            </div>





        </div>
    )
}

export default Contract
