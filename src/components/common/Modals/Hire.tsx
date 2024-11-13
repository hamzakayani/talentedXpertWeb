import { Icon } from '@iconify/react/dist/iconify.js'
import { Milonga } from 'next/font/google'
import React, { useEffect, useState } from 'react'

const Hire = ({ isOpen, onClose }: any) => {

    const [open, setOpen] = useState<boolean>(false)
    const [milestone, setMilestone] = useState<any>([])

    useEffect(() => {
      setOpen(true);
      if (isOpen && milestone.length === 0) {
          setMilestone([{ amount: '', date: '' }]); 
      }
  }, [isOpen]);
    
      const handleClose = () => {
        onClose();
      }

      const onDelete = (index: number) => {
        const updatedQuestions = milestone.filter((_: any, i: number) => i !== index);
        setMilestone(updatedQuestions);
        
    };
    const addMilestone =() =>{
       setMilestone((prev: any) => [...prev, { amount: ''}]);
    }  
    
    const handledate =  (e: React.ChangeEvent<HTMLInputElement>, index: number) =>{
      const newQuestionArr = [...milestone];
      newQuestionArr[index].date = e.target.value;
      setMilestone(newQuestionArr);
      console.log('d', milestone)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newQuestionArr = [...milestone];
      newQuestionArr[index].amount = e.target.value;
      setMilestone(newQuestionArr);
      console.log('mm', milestone)
  };
  

  return (
    <div>
     {open && <div className='create-milstone'>
        <div className="modal fade" id="exampleHiredProposal"  aria-hidden="true" aria-labelledby="exampleModalHiredProposal" tabIndex={1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-white" id="exampleModalToggleLabel2">Create Milestone</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                <Icon icon="line-md:plus-square-filled" className='text-info' width={32} height={32}  onClick={addMilestone}/>
              </div>
              <div className="modal-body">


               
                <div className='table-responsive'>
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">SR</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Date</th>
                        <th scope="col"></th>


                      </tr>
                    </thead>
                    <tbody>
                    {milestone?.length > 0 && milestone.map((data: any, index: number) => (
                      <tr className='table-dark' key={index}>
                        <th scope="row"> </th>
                        <td>{index + 1}</td>
                        <td><input type="email" className="form-control text-white" id="exampleFormControlInput1" placeholder="$" onChange={(e) => handleChange(e, index)}/></td>
                        <td><input type='date' onChange={(e) => handledate(e, index)}></input></td>
                        <td><Icon icon="line-md:minus-square-filled" className='text-info' width={32} height={32}  onClick={() => onDelete(index)}/></td>
                      </tr>))}
                    </tbody>
                  </table>
                </div>



              </div>
              <div className="modal-footer">
                <div className="d-grid gap-2">

                </div>
                <button type="button" className="btn btn-primary">Submit</button>
              </div>
            </div>
          </div>
        </div>





      </div>}
    </div>
  )
}

export default Hire
