import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';

const ViewProposal = () => {
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
                    <Image
                      src="/assets/images/profile-img.png"
                      alt="img"
                      className="img-fluid user-img img-round"
                      width={100}
                      height={100}
                      priority
                    />
                    <h2>John Smith</h2>
                  </div>
                </div>
                <div className=' col-9 p-4'>
                  <div className='priceanddate d-flex justify-content-between bordr'>
                    <div className='stars'>
                      <h4>Wordpress Project</h4>
                      <Icon icon="ic:baseline-star" className='text-warning' />
                      <Icon icon="ic:baseline-star" className='text-warning' />
                      <Icon icon="ic:baseline-star" className='text-warning' />
                      <Icon icon="mdi-light:star" className='text-light' />
                      <Icon icon="mdi-light:star" className='text-light' />
                    </div>
                    <div>
                      <span>2 days ago</span>
                      <h5>$20 / hr</h5>
                    </div>
                  </div>
                  <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...`}
                  </p>

                  <div className='btn-border'>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Reject</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Shortlist</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Message</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Complete</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1 "  data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">Submit Review</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Payment</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Interview questions</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Hire</button>


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
                <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-white" id="exampleModalToggleLabel2">Add Dispute</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">


                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Reason</label>
                                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Reason" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Description</label>
                                    <textarea className="form-control" id="exampleFormControlTextarea1" rows={3}></textarea>
                                </div>



                                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                        <div className='Table table-responsive'>
                            <table className="table ">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">Serial Number</th>
                                        <th scope="col">DATE</th>
                                        <th scope="col">TYPE</th>
                                        <th scope="col">DESCRIPTION</th>
                                        <th scope="col">DEBIT</th>
                                        <th scope="col">CREDIT</th>
                                        <th scope="col">BALANCE</th>
                                        <th scope="col">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className='table-dark'>
                                        <th scope="row">01</th>
                                        <td>12/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">02</th>
                                        <td>12/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">03</th>
                                        <td>16/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">04</th>
                                        <td>14/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">05</th>
                                        <td>13/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">06</th>
                                        <td>12/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                        <div className='Table table-responsive '>
                            <table className="table ">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">Serial Number</th>
                                        <th scope="col">DATE</th>
                                        <th scope="col">TYPE</th>
                                        <th scope="col">DESCRIPTION</th>
                                        <th scope="col">DEBIT</th>
                                        <th scope="col">CREDIT</th>
                                        <th scope="col">BALANCE</th>
                                        <th scope="col">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className='table-dark'>
                                        <th scope="row">01</th>
                                        <td>12/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">02</th>
                                        <td>12/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">03</th>
                                        <td>16/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">04</th>
                                        <td>14/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">05</th>
                                        <td>13/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">06</th>
                                        <td>12/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabIndex={0}>
                        <div className='Table table-responsive'>
                            <table className="table ">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">Serial Number</th>
                                        <th scope="col">DATE</th>
                                        <th scope="col">TYPE</th>
                                        <th scope="col">DESCRIPTION</th>
                                        <th scope="col">DEBIT</th>
                                        <th scope="col">CREDIT</th>
                                        <th scope="col">BALANCE</th>
                                        <th scope="col">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className='table-dark'>
                                        <th scope="row">01</th>
                                        <td>12/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">02</th>
                                        <td>12/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">03</th>
                                        <td>16/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">04</th>
                                        <td>14/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">05</th>
                                        <td>13/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                    <tr className='table-dark'>
                                        <th scope="row">06</th>
                                        <td>12/06/2024</td>
                                        <td>Received</td>
                                        <td>Sevilleta_LTER_NM_2001_NPP</td>
                                        <td>5.00</td>
                                        <td>7</td>
                                        <td>$30000</td>
                                        <td>PAID</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>

                            </div>
                            <div className="modal-footer">
                                <div className="d-grid gap-2">
                                    <button className="btn bg-gray text-white fs-12" type="button"><Icon icon="uil:upload" className='me-1' /> File Upload</button>
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