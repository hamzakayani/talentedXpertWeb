import apiCall from '@/services/apiCall/apiCall'
import { requests } from '@/services/requests/requests'
import { RootState, useAppDispatch } from '@/store/Store'
import { Icon } from '@iconify/react/dist/iconify.js'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import MsgNotifier from '../MsgNotifier/MsgNotifier'
import { toast } from 'react-toastify'

const Hire = ({ milestone, setMilestones, contract, type }: any) => {
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
    "milestones": milestone?.map((data: any) => (
      {
        "contractId": contract.id,
        "amount": Number(data.amount),
        "duration": data.date,
        "date": new Date(),
        "status": type
          ? (data.isTEApproved ? 'APPROVED' : data.status)
          : 'APPROVAL_PENDING',
        "isTEApproved": data.isTEApproved || false,
        "isTRApproved": true,
        ...(type && data.id && { id: Number(data.id) })
      }
    )),
    ...(type && { milestoneIdsToDelete }),
  }

  useEffect(() => {
    if (milestone?.length === 0) {
      setMilestones([{ amount: '', date: '', status: 'APPROVAL_PENDING', isTEApproved: false }]);
    }
    // if (milestone?.some((m: any) => m.isTEApproved)) {
    //   handleSubmit();
    // }
    const updatedTotalAmount = milestone?.reduce(
      (acc: number, item: any) => acc + (Number(item.amount) || 0),
      0
    );
    setTotalAmount(updatedTotalAmount);
    console.log('path', pathName)
    // setError('')
  }, [milestone]);

  const onDelete = (id: number, index: any) => {
    setMilestoneIdsToDelete((prev: any) => [...prev, id])
    const updatedQuestions = milestone.filter((_: any, i: number) => i !== index);
    setMilestones(updatedQuestions);
  };

  const addMilestone = () => {
    const incomplete = milestone.some((m: any) => !m.amount || !m.date);
    if (incomplete) {
      setError('Please fill in all fields before adding a new milestone.');
      return;
    }
    else {
      setError('')
    }
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
  console.log('error', error)

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

  const handleApprove = (index: number) => {
    const newMilestones = [...milestone];
    newMilestones[index].isTEApproved = true;
    setMilestones(newMilestones);
    // handleSubmit()
  }

  return (
    <div>
      <div className='create-milstone'>
        <div className="modal fade" id="exampleHiredProposal" aria-hidden="true" aria-labelledby="exampleModalHiredProposal" tabIndex={1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header justify-content-between">
                <h5 className="modal-title text-white" id="exampleModalToggleLabel2">{user?.profile?.length> 0 && user?.profile[0]?.type === 'TR' ? 'Create Milestone' : 'Milestones'}</h5>
                {/* <button type="button" className="btn-close btn rounded-pill btn-outline-info " data-bs-dismiss="modal" aria-label="Close"></button> */}
                {user?.profile?.length> 0 && user?.profile[0]?.type === 'TR' ? <Icon icon="line-md:plus-square-filled" className='text-info' width={32} height={32} onClick={addMilestone} /> : ''}
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
                            <input type="number" value={data.amount} className="form-control text-white" id="exampleFormControlInput1" placeholder="$" onChange={(e) => handleChange(e, index)} />
                          </td>
                          <td>
                            <input type='date' value={
                              data?.date && !isNaN(new Date(data?.date).getTime())
                                ? new Date(data?.date).toISOString().split('T')[0]
                                : ""
                            } onChange={(e) => handledate(e, index)}></input>
                          </td>
                          {/* <td><button className='btn rounded-pill btn-outline-info mx-1 my-1'>{data.status}</button></td> */}
                          <td>{data.status}</td>
                          <td>
                            {user?.profile?.length> 0 && user?.profile[0]?.type === 'TE' ? (
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
                            {user?.profile?.length> 0 && user?.profile[0]?.type === 'TR' ? <Icon icon="line-md:minus-square-filled" className='text-info' width={32} height={32} onClick={() => onDelete(data.id, index)} /> : ''}
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
                <button type="button" className="btn btn-primary" onClick={handleSubmit} >Submit</button>
              </div>
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
