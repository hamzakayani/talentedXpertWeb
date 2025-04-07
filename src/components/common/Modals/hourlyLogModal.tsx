'use client'
import HoursHistory from '@/components/dashboardComponents/viewTasks/HoursHistory'
import React from 'react'

const HourlyLogModal = ({task, weekIndex}:any) => {
    console.log('ww', weekIndex)
    // console.log('weekIndex',task?.weeklyMilestones[weekIndex])
  return (
    <form>
            <div className='ad-dispute'>
                <div className="modal fade" id="exampleModalToggle555" aria-hidden="true" aria-labelledby="exampleModalToggleLabe555" tabIndex={1}>
                    <div className="modal-dialog  modal-dialog-centered modal-dialog-scrollable modal-xl ">

                        <div className="modal-content modal-content-center ">

                            <div className="modal-header">
                                <h5 className="modal-title text-white" id="exampleModalToggleLabel555">Hours</h5>
                                <button type="button" className="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                             <HoursHistory HoursHistory={task?.weeklyMilestones} milestoneIndex={Number(weekIndex)} />



                            </div>
                            
                        </div>

                    </div>
                </div>





            </div>
        </form>
  )
}

export default HourlyLogModal





 