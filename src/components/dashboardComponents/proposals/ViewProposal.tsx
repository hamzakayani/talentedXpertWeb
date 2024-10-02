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
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Submit Review</button>
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
              <p>Highly organized and creative force in the world of web development. With over 4 years of hands-on experience in the Angular framework, I bring a unique blend of skills and expertise to the table. I also thrive on turning your vision into reality. Your requirements are not just a checklist; they're my mission highly organized and creative force in the world of web development. With over 4 years of hands-on experience in the Angular framework, I bring a unique blend of skills and expertise to the table. I also thrive on turning your vision into reality. Your requirements are not just a checklist; they're my mission</p>
            </div>
          </div>
        </div>












      </div>
    </div>


  )
}

export default ViewProposal