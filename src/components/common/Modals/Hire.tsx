import apiCall from '@/services/apiCall/apiCall'
import { requests } from '@/services/requests/requests'
import { RootState, useAppDispatch } from '@/store/Store'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Milonga } from 'next/font/google'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Hire = ({ isOpen, onClose, milestone, setMilestones, setTotalAmount, totalAmount,id }: any) => {
  const user = useSelector((state: RootState) => state.user)
  const [error, setError] = useState<string>('');
  const dispatch = useAppDispatch();
  const router = useRouter()

  const [open, setOpen] = useState<boolean>(false)
  let data= {
    "milestones": milestone.map((data:any)=>(
  {
    "contractId": id,
    "amount": Number(data.amount),
    "duration": data.date,
    "date": new Date(),
    "status": "CREATED",
    "isTEApproved": false,
    "isTRApproved": true
  }
    ))
  }

  useEffect(() => {
    setOpen(true);
    if (isOpen && milestone?.length === 0) {
      setMilestones([{ amount: '', date: '' }]);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  }

  const onDelete = (index: number) => {
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
    setMilestones((prev: any) => [...prev, { amount: '' }]);
    console.log('mile', milestone)

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
    const updatedTotalAmount = newMilestone.reduce((acc, item) => acc + Number(item.amount), 0);
    setTotalAmount(updatedTotalAmount)

  };
  const handleSubmit = async () => {
      await apiCall(requests.makeMilestone, data, 'post', false, dispatch, user, router).then((res: any) => {
        console.log('res milestone', res)


      }).catch(err => console.warn(err))
    }
  


  return (
    <div>
      {open && <div className='create-milstone'>
        <div className="modal fade" id="exampleHiredProposal" aria-hidden="true" aria-labelledby="exampleModalHiredProposal" tabIndex={1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-white" id="exampleModalToggleLabel2">Create Milestone</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                <Icon icon="line-md:plus-square-filled" className='text-info' width={32} height={32} onClick={addMilestone} />
              </div>
              <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>} 



                <div className='table-responsive'>
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">SR</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Date</th>
                        <th scope="col">status</th>
                        <th scope="col"></th>


                      </tr>
                    </thead>
                    <tbody>
                      {milestone?.length > 0 && milestone.map((data: any, index: number) => (
                        <tr className='table-dark' key={index}>
                          <th scope="row"> </th>
                          <td>{index + 1}</td>
                          <td><input type="number" className="form-control text-white" id="exampleFormControlInput1" placeholder="$" onChange={(e) => handleChange(e, index)} /></td>
                          <td><input type='date' onChange={(e) => handledate(e, index)}></input></td>
                          <td><button className='btn rounded-pill btn-outline-info mx-1 my-1'>Pay now</button></td>
                          <td><Icon icon="line-md:minus-square-filled" className='text-info' width={32} height={32} onClick={() => onDelete(index)} /></td>
                        </tr>))}
                      <tr className='table-dark'>
                        <th scope="col"></th>
                        <td scope="col">Total Amount</td>
                        <td scope="col"><input  className="form-control text-white" id="exampleFormControlInput1" placeholder="$" readOnly value={String(totalAmount)} /></td>
                        <td scope="col"></td>
                        <td scope="col"></td>
                        <td scope="col"></td>
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





      </div>}
    </div>
  )
}

export default Hire
