import apiCall from '@/services/apiCall/apiCall'
import { requests } from '@/services/requests/requests'
import { RootState, useAppDispatch } from '@/store/Store'
import { Icon } from '@iconify/react/dist/iconify.js'
import { usePathname, useRouter } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import MsgNotifier from '../MsgNotifier/MsgNotifier'
import { toast } from 'react-toastify'
import { Pagination } from '../Pagination/Pagination'


const Hire:FC<any> = ({ milestone, setMilestones, contract, type, amount, areAllMilestonesApproved, taskStatus, count, page ,limit  ,onPageChange ,onLimitChange }: any) => {
  const user = useSelector((state: RootState) => state.user)
  const [error, setError] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<Number>(0)
  const [msgNotify, setMsgNotify] = useState<boolean>(false);
  const [milestoneIdsToDelete, setMilestoneIdsToDelete] = useState<any>([])
  const [approveMilestone, setApproveMilestone] = useState<any>([])
  const dispatch = useAppDispatch();
  const router = useRouter()
  const pathName = usePathname()

  const [open, setOpen] = useState<boolean>(false)

  let data = {
    ...(milestone?.length > 0 && {
      milestones: milestone?.map((data: any) => ({
        contractId: contract?.id,
        amount: Number(data?.amount),
        duration: data?.date,
        date: new Date(),
        status: type
          ? (data?.isTEApproved ? data?.status==='PAID'? 'PAID' :'APPROVED' : data?.status)
          : 'APPROVAL_PENDING',
        isTEApproved: data?.isTEApproved || false,
        isTRApproved: true,
        ...(type && data?.id && { id: Number(data?.id) }) 
      }))
    }),
    ...(type && { milestoneIdsToDelete }) 
  };


  useEffect(() => {
    console.log('mile', milestone, typeof(milestone))
    if (milestone?.length === 0) {
      setMilestones([{ amount: '', date: '', status: 'APPROVAL_PENDING', isTEApproved: false }]);

    }
    if (milestone?.length > 0) {
      const updatedTotalAmount = milestone?.reduce(
        (acc: number, item: any) => acc + (Number(item?.amount) || 0),
        0
      );
      setTotalAmount(updatedTotalAmount);
    }

  }, [milestone]);

  const onDelete = (id: number, index: any) => {
    setMilestoneIdsToDelete((prev: any) => [...prev, id])
    const updatedQuestions = milestone.filter((_: any, i: number) => i !== index);
    setMilestones(updatedQuestions);
  };

  const addMilestone = () => {
    const incomplete = milestone?.some((m: any) => !m.amount || !m.date);
    if (incomplete) {
      setError('Please fill in all fields before adding a new milestone.');
      return;
    }
    else {
      setError('')
    }
    console.log('mimimi', milestone)
    setMilestones((prev: any) => [...prev, { amount: '', status: 'APPROVAL_PENDING' }]);
    setError('')
  }

  const handledate = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newQuestionArr = [...milestone];
    newQuestionArr[index].date = e.target.value;
    setMilestones(newQuestionArr);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newMilestone = [...milestone];
    newMilestone[index].amount = e.target.value;
    setMilestones(newMilestone);
  };

  const handleSubmit = async () => {
    const incomplete = milestone.some((m: any) => !m.amount || !m.date);
    if (incomplete) {
      setError('Please fill in all fields');
      // setError('')
      return;

    }
    else {
      setError('')
      await apiCall(requests.makeMilestone, data, `${type ? 'patch' : 'post'}`, false, dispatch, user, router).then((res: any) => {
        if (!type) {
          setMsgNotify(true)
        }

      }).catch(err => console.warn(err))
      toast.success('Submitted')
    }

  }

  const handleApprove = async (index: number) => {
    const newMilestones = [...milestone];
    newMilestones[index].isTEApproved = true;
    newMilestones[index].status = 'APPROVED';
    // setMilestones(newMilestones);
    await apiCall(requests.makeMilestone, {
      ...data,
      milestones: newMilestones
    }, 'patch', false, dispatch, user, router).then((res: any) => {
      setMilestones(newMilestones);
      toast.success('Approved successfully')

    }).catch(err => console.warn(err))
    // handleSubmit()
  }
  
  const handlePayNow = async (index: number)=>{
    const newMilestones = [...milestone];
    newMilestones[index].status = 'PAID';
    // setMilestones(newMilestones);
    await apiCall(requests.makeMilestone, {
      ...data,
      milestones: newMilestones
    }, 'patch', false, dispatch, user, router).then((res: any) => {
      setMilestones(newMilestones);
      toast.success('Paid successfully')

    }).catch(err => console.warn(err))
  }

  return (
    <div>
      <div className='create-milstone'>
        <div className="modal fade" id="exampleHiredProposal" aria-hidden="true" aria-labelledby="exampleModalHiredProposal" tabIndex={1}>  
        
          <div className="modal-dialog modal-dialog-centered modal-dialog modal-xl"> 
            <div className="modal-content p-r">
           
              <div className="modal-header justify-content-between mx-5 ">
              <button type="button" className="btn-close bg-light p-a me-3" data-bs-dismiss="modal" aria-label="Close"></button>
                <h5 className="modal-title text-white">{user?.profile?.length > 0 && user?.profile[0]?.type === 'TR' ? 'Create Milestone' : 'Milestones'}</h5>

                <div className='d-flex'>

                {user?.profile[0]?.type === 'TR' && !areAllMilestonesApproved && <Icon icon="line-md:plus-square-filled" className='text-info ' width={32} height={32} onClick={addMilestone} />}
                {/* <button type="button" className="btn-close  bg-light p-a me-2 " data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" aria-label="Close"></button> */}
                </div>
                {/* <button type="button" className="btn-close btn rounded-pill btn-outline-info " data-bs-dismiss="modal" aria-label="Close"></button> */}
                
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className='table-responsive'>
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">SR</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col" className='text-center'>Action</th>
                      </tr>
                    </thead>
                    <tbody className='table-dark'>
                      {milestone?.length > 0 && milestone.map((data: any, index: number) => (
                        <tr key={index}>
                          <td>
                            {index + 1}
                          </td>
                          <td>
                            <input type="number" value={data?.amount} className="form-control text-white" id="exampleFormControlInput1" placeholder="$" onChange={(e) => handleChange(e, index)} />
                          </td>
                          <td>
                            <input type='date' className='invert bg-light  text-dark border-0 p-1' value={
                              data?.date && !isNaN(new Date(data?.date).getTime())
                                ? new Date(data?.date).toISOString().split('T')[0]
                                : ""
                            } onChange={(e) => handledate(e, index)}></input>
                          </td>
                          {/* <td><button className='btn rounded-pill btn-outline-info mx-1 my-1'>{data.status}</button></td> */}
                          <td>{data?.status}</td>
                          <td>
                            {user?.profile?.length > 0 && user?.profile[0]?.type === 'TE' ? (
                              milestone[index]?.isTEApproved ? (
                                <span className='d-flex align-items-center justify-content-center'>✔</span> // Display tick if approved
                              ) : (
                                <button
                                  className="btn rounded-pill btn-outline-info mx-1 my-1"
                                  onClick={() => handleApprove(index)}
                                >
                                  Approve
                                </button>
                              )
                            ) : ''}
                            {milestone[index]?.isTEApproved && user?.profile?.[0]?.type === 'TR' ? (
                              <button className="btn rounded-pill btn-outline-info mx-1 my-1" disabled={milestone[index]?.status === 'PAID'} onClick={() => handlePayNow(index)}>Pay Now</button>
                            ) : (
                              user?.profile?.[0]?.type === 'TR' && (
                                <Icon
                                  icon="line-md:minus-square-filled"
                                  className="text-info"
                                  width={32}
                                  height={32}
                                  onClick={() => onDelete(data.id, index)}
                                />
                              )
                            )}
                            {/* {user?.profile?.length> 0 && user?.profile[0]?.type === 'TR' ? <Icon icon="line-md:minus-square-filled" className='text-info' width={32} height={32} onClick={() => onDelete(data.id, index)} /> : ''} */}
                          </td>
                        </tr>))}
                      <tr>
                        <td colSpan={5}>
                          <span className='pt-3 pb-3'>
                            Total Amount :
                            <span className="text-white ms-2">
                              $ {String(totalAmount)}
                            </span>
                          </span>
                          {user?.profile[0]?.type === 'TR' && <div className='text-danger fs-12'>* Total amount should be equal to proposal amount </div>}
                        </td>
                        {/* <td colSpan={3}>Total Amount</td>
                        <td scope="col" colSpan={2}><input className="form-control text-white" id="exampleFormControlInput1" placeholder="$" readOnly value={String(totalAmount)} /></td> */}
                      </tr>
                    </tbody>
                  </table>
                </div>



              </div>
              <div className="modal-footer">
                <div className="d-grid gap-2">

                </div>
                {user?.profile[0]?.type === 'TR' && taskStatus!=='COMPLETED' &&  taskStatus!=='INPROGRESS' && <button type="button" className="btn btn-primary" disabled={totalAmount !== amount } onClick={handleSubmit} >Submit</button>}
              </div>
              {count > 0 && <Pagination count={count} page={page} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} siblingCount={1} />}

            </div>
          </div>
        </div> 

        {msgNotify && <MsgNotifier
          senderProfileId={user.id}
          receiverProfileId={contract?.updatedBy}
          text="Milestone has been created"
          taskId={contract?.proposal?.taskId}
        />}



      </div>
      
    </div>
  )
}

export default Hire
