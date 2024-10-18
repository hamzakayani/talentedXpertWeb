'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import { useParams, useRouter } from 'next/navigation';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { getTimeago } from '@/services/utils/util';
import ImageFallback from '@/components/common/ImageFallback/ImageFallback';

const ViewProposal = () => {
  let { proposalId } = useParams()
  // let { id } = useParams(); 
  // id = Number(id);
  const dispatch = useAppDispatch();
  const router = useRouter()
  const user = useSelector((state: RootState) => state.user)
  const [proposal, setProposal] = useState<any>({})

  const getProposals = async () => {
    try {
      const response = await apiCall(requests.getProposals, { id: Number(proposalId) }, 'get', false, dispatch, user, router);
      setProposal(response?.data?.data?.proposals[0] || {});
    } catch (error) {
      console.warn("Error fetching tasks:", error);
    }
  }
  
  useEffect(() => {
    getProposals();
  }, [])

  return (
    <div className='card'>
      <div className='card first-card card-header'>
        <h3>View TalentXpert proposal</h3>
      </div>
      <div className='card-bodyy my-active-task'>


        <div className='row'>
          <div className='col-md-7'>
            <div className="box m-2 ">
              <div className='row'>
                <div className='  col-3  '>
                  <div className=' card-profile text-center mt-4 '>
                    
                    <ImageFallback
                     src="/assets/images/profile-img.png"
                     alt="img"
                     className="img-fluid user-img img-round"
                     width={100}
                     height={100}
                     priority
                    />
                    <h2>{proposal?.expertProfile?.user?.firstName} {proposal?.expertProfile?.user?.lastName}</h2>
                  </div>
                </div>
                <div className=' col-9 p-4'>
                  <div className='priceanddate d-flex justify-content-between bordr'>
                    <div className='stars'>
                      <h4>{proposal?.task?.name}</h4>
                      <Icon icon="ic:baseline-star" className='text-warning' />
                      <Icon icon="ic:baseline-star" className='text-warning' />
                      <Icon icon="ic:baseline-star" className='text-warning' />
                      <Icon icon="mdi-light:star" className='text-light' />
                      <Icon icon="mdi-light:star" className='text-light' />
                    </div>
                    <div>
                      <span>{getTimeago(proposal.createdAt)}</span>
                      <h5>${proposal?.amount}</h5>
                    </div>
                  </div>
                  <p>{proposal?.details}</p>

                  <div className='btn-border'>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Reject</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Shortlist</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Message</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Complete</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1 " data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">Submit Review</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Payment</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Interview questions</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1" data-bs-target="#exampleModalToggle3" data-bs-toggle="modal">Hire</button>
                  </div>

                </div>

              </div>
            </div>
          </div>
          <div className='col-md-5'>
            <div className='my-project p-2'>
              <div className='d-flex'>
                <h3 className='me-2'>Traditional Elegant Matrimonial
                  Web App</h3>
                <h5 className='w-9'>$1000 USD</h5>
              </div>
              <p>
                {`Highly organized and creative force in the world of web development. With over 4 years of hands-on experience in the Angular framework, I bring a unique blend of skills and expertise to the table. I also thrive on turning your vision into reality. Your requirements are not just a checklist; they're my mission highly organized and creative force in the world of web development. With over 4 years of hands-on experience in the Angular framework, I bring a unique blend of skills and expertise to the table. I also thrive on turning your vision into reality. Your requirements are not just a checklist; they're my mission`}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='ad-review'>
        <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-white" id="exampleModalToggleLabel2">Add Review</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">


                <div className="mb-3 d-flex">
                  <label htmlFor="exampleFormControlInput1" className="form-label me-4">Add Rating :</label>
                  <div className='stars'>

                    <Icon icon="ic:baseline-star" className='text-warning' />
                    <Icon icon="ic:baseline-star" className='text-warning' />
                    <Icon icon="ic:baseline-star" className='text-warning' />
                    <Icon icon="mdi-light:star" className='text-light' />
                    <Icon icon="mdi-light:star" className='text-light' />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleFormControlTextarea1" className="form-label">Comments</label>
                  <textarea className="form-control" id="exampleFormControlTextarea1" rows={3}></textarea>
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





      </div>



      <div className='create-milstone'>
        <div className="modal fade" id="exampleModalToggle3" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-white" id="exampleModalToggleLabel2">Create Milestone</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">


                <div className="mb-3 ">
                  <label htmlFor="exampleFormControlInput1" className="form-label me-4">Add Rating :</label>

                </div>
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
                      <tr className='table-dark'>
                        <th scope="row"> <Icon icon="line-md:plus-square-filled" className='text-info' width={32} height={32} /></th>
                        <td>1</td>
                        <td><input type="email" className="form-control text-white" id="exampleFormControlInput1" placeholder="$" /></td>
                        <td><Icon icon="uiw:date" /></td>
                        <td>05/08/2024</td>

                      </tr>
                      <tr className='table-dark'>
                        <th scope="row"> <Icon icon="line-md:plus-square-filled" className='text-info' width={32} height={32} /></th>
                        <td>1</td>
                        <td><input type="email" className="form-control" id="exampleFormControlInput1" placeholder="$" /></td>
                        <td><Icon icon="uiw:date" /></td>
                        <td>05/08/2024</td>

                      </tr>
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





      </div>




    </div>


  )
}

export default ViewProposal