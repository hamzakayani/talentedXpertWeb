import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Sidebar from './sidebar/sidebar';


const Home = () => {
    return (
                    <div className='col-lg-10 col-md-9'>
                        <div className='top-card '>
                            <section className="promoted_te_section pb-3">
                                <div className="row">
                                    <div className="col-sm-6 col-xl-3 mb-2">
                                        <div className="promoted_card">
                                            <div className="card_heading top-cards">

                                                <div className="dib">
                                                    <span className="material-symbols-outlined bg-white text-dark rounded-pill fs-2 p-lg-3 p-md-1">
                                                        group_add
                                                    </span>
                                                    <div className="victorimgup"></div>
                                                </div>


                                                <h5>Tasks</h5>


                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-xl-3 mb-2">
                                        <div className="promoted_card">
                                            <div className="card_heading top-cards">

                                                <div className="dib">
                                                    <span className="material-symbols-outlined bg-white text-dark rounded-pill fs-2 p-lg-3 p-md-1 ">
                                                        group_add
                                                    </span>
                                                    <div className="victorimgup"></div>
                                                </div>

                                                <div className="usertext">
                                                    <h5>TalentedXpert</h5>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-xl-3 mb-2">
                                        <div className="promoted_card">
                                            <div className="card_heading top-cards">

                                                <div className="dib">
                                                    <span className="material-symbols-outlined bg-white text-dark rounded-pill fs-2 p-lg-3 p-md-1">
                                                        group_add
                                                    </span>
                                                    <div className="victorimgup"></div>
                                                </div>

                                                <div className="usertext">
                                                    <h5>Rating</h5>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-xl-3 mb-2">
                                        <div className="promoted_card">
                                            <div className="card_heading top-cards">

                                                <div className="dib">
                                                    <span className="material-symbols-outlined bg-white text-dark rounded-pill fs-2 p-lg-3 p-md-1">
                                                        group_add
                                                    </span>
                                                    <div className="victorimgup"></div>
                                                </div>

                                                <div className="usertext">
                                                    <h5>Payments</h5>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>

                        <div className='card'>
                            <div className='first-card card-header d-flex justify-content-between px-4 bg-gray'>
                                <div className='card-left-heading'>
                                    <h3>My Acitve Task</h3>
                                </div>

                                <div className='card-right-heading d-flex justify-content-between'>
                                    <span className='me-3'>Add New Task</span>
                                    <Icon icon="line-md:plus-square-filled" className='text-info' width={32} height={32} />
                                </div>

                            </div>

                            <div className='card-bodyy my-active-task'>

                                <div className="box m-2">

                                    <div className="ribbon ribbon-top-right"><span>Disability</span></div>

                                    <div className='row'>


                                        <div className='col-lg-1 col-md-2  '>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                            <div className='text-lg-end card-profile  mt-4 '>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />
                                                <h2>John Smith</h2>
                                            </div>
                                        </div>
                                        <div className='col-lg-10 col-md-8 p-4'>
                                            <div className='priceanddate d-flex justify-content-between bordr'>
                                                <h4>Tech Lead Software Engineer</h4>
                                                <div>
                                                    <span>2 days ago</span>
                                                    <h5>$20 / hr</h5>
                                                </div>

                                            </div>
                                            <p>A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...

                                            </p>


                                            <div className='card-footer d-flex justify-content-between'>
                                                <div>

                                                    <button className="btn btn-black rounded-pill ls ">Wordpress</button>
                                                    <button className="btn btn-black rounded-pill mx-2">Angular React</button>



                                                </div>


                                                <button className="btn rounded-pill btn-outline-info">View Details<Icon icon="ic:sharp-arrow-forward" /></button>


                                            </div>

                                        </div>

                                    </div>
                                </div>

                            </div>

                            <div className='card-bodyy my-active-task'>

                                <div className="box m-2">

                                    <div className="ribbon ribbon-top-right"><span>Disability</span></div>

                                    <div className='row'>


                                        <div className='col-lg-1 col-md-2  '>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                            <div className='text-end card-profile  mt-4  '>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />
                                                <h2>John Smith</h2>
                                            </div>
                                        </div>
                                        <div className='col-lg-10 col-md-8 p-4'>
                                            <div className='d-flex bordr'>
                                                <h4>Tech Lead Software Engineer</h4>
                                                <h5>$20 / hr</h5>
                                            </div>
                                            <p>A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...

                                            </p>
                                            <div className='card-footer d-flex justify-content-between'>
                                                <div>

                                                    <button className="btn btn-black rounded-pill ls ">Wordpress</button>
                                                    <button className="btn btn-black rounded-pill mx-2">Angular React</button>



                                                </div>


                                                <button className="btn rounded-pill btn-outline-info">View Details<Icon icon="ic:sharp-arrow-forward" /></button>

                                            </div>

                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div className='card-bodyy my-active-task'>

                                <div className="box m-2">

                                    <div className="ribbon ribbon-top-right"><span>Disability</span></div>

                                    <div className='row'>


                                        <div className='col-lg-1 col-md-2  '>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                            <div className='text-end card-profile  mt-4  '>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />
                                                <h2>John Smith</h2>
                                            </div>
                                        </div>
                                        <div className='col-lg-10 col-md-8 p-4'>
                                            <div className='d-flex bordr'>
                                                <h4>Tech Lead Software Engineer</h4>
                                                <h5>$20 / hr</h5>
                                            </div>
                                            <p>A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...

                                            </p>
                                            <div className='card-footer d-flex justify-content-between'>
                                                <div>

                                                    <button className="btn btn-black rounded-pill ls ">Wordpress</button>
                                                    <button className="btn btn-black rounded-pill mx-2">Angular React</button>



                                                </div>


                                                <button className="btn rounded-pill btn-outline-info">View Details<Icon icon="ic:sharp-arrow-forward" /></button>

                                            </div>

                                        </div>

                                    </div>
                                </div>

                            </div>







                            <div className='pagiandnumber d-flex justify-content-between px-5 bg-black'>
                                <div className='Numbring d-flex align-items-center'>
                                    <span>Show</span>
                                    <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                                        <option selected>3</option>
                                        <option value="1">5</option>
                                        <option value="2">20</option>
                                        <option value="3">50</option>
                                    </select>
                                    <span>entries</span>
                                </div>
                                <div className='pagination'>
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination">
                                            <li className="page-item">
                                                <a className="page-link" href="#" aria-label="Previous">
                                                    <span aria-hidden="true">&laquo;</span>
                                                </a>
                                            </li>
                                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                                            <li className="page-item">
                                                <a className="page-link" href="#" aria-label="Next">
                                                    <span aria-hidden="true">&raquo;</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>






                        </div>


                        {/* second card */}

                        <div className='card'>
                            <div className='viewtask-card card-header  px-4 bg-gray'>
                                <div className='card-left-heading'>
                                    <h3>View Task Details</h3>
                                </div>



                            </div>

                            <div className='card-bodyy viewtask'>

                                <div className="box m-2 p-4">

                                    <h4>Angular Project Details EMR Clinic System</h4>
                                    <p>One project that I take immense pride worked and is almost near to launch is an EMR system for clinics in Canada. I started this project from the scratch and worked on it's frontend and backend as well. The product acts as a centralized database
                                        that stores and organizes patient information, medical history, diagnoses, treatments, and other relevant data. </p>

                                    <div className='keyfun mt-4'>
                                        <h5>The key functionalities of the EMR system includes: </h5>
                                        <ul>
                                            <li><a>Patient Records Management</a></li>
                                            <li><a>Appointment Scheduling</a></li>
                                            <li><a>Clinical Documentation (includes faxes, patient's reports etc)</a></li>
                                            <li><a>Billing of each appointment</a></li>
                                            <li><a>Settings (to customize the app the way assistant wants to) </a></li>
                                        </ul>
                                    </div>

                                    <div className='document d-grid my-4'>
                                        <h6>Document</h6>
                                        <span>1. CDD Check/Salespersons Checklist on.word</span>
                                        <span>2. CDD Check/Salespersons Checklist on.word</span>

                                        <div className='btn-border mt-4'>
                                                    <button className="btn rounded-pill btn-outline-info mx-1">Edit</button>
                                                    <button className="btn rounded-pill btn-outline-info mx-1">Shortlist</button>
                                                    <button className="btn rounded-pill btn-outline-info mx-1">Proposals</button>
                                                    <button className="btn rounded-pill btn-outline-info mx-1">Milestones</button>
                                                    <button className="btn rounded-pill btn-outline-info mx-1">Messages</button>


                                                </div>
                                    </div>

                                    <div className="box m-2 bg-black">


                                        <div className='row'>


                                            <div className='col-lg-1 col-md-2  '>

                                                <div className='text-lg-end card-profile  mt-4 '>

                                                    <Image
                                                        src="/assets/images/profile-img.png"
                                                        alt="img"
                                                        className="img-fluid user-img img-round"
                                                        width={60}
                                                        height={60}
                                                        priority
                                                    />
                                                    <h2>John Smith</h2>
                                                </div>
                                            </div>
                                            <div className='col-lg-10 col-md-8 p-4'>
                                                <div className='priceanddate d-flex justify-content-between bordr'>

                                                    <div className='stars'>
                                                        <h4>Wordpress Project</h4>
                                                        <Icon icon="ic:baseline-star" />
                                                        <Icon icon="ic:baseline-star" />
                                                        <Icon icon="ic:baseline-star" />
                                                        <Icon icon="mdi-light:star" />
                                                        <Icon icon="mdi-light:star" /></div>
                                                    <div>
                                                        <span>2 days ago</span>
                                                        <h5>$20 / hr</h5>
                                                    </div>

                                                </div>
                                                <p>A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...

                                                </p>


                                                <div className='card-footer d-flex justify-content-between'>
                                                    <div>

                                                        <button className="btn btn-dark rounded-pill hero-btn ls ">Wordpress</button>
                                                        <button className="btn btn-dark rounded-pill hero-btn mx-2">Angular React</button>



                                                    </div>







                                                </div>
                                                <div className='btn-border'>
                                                    <button className="btn rounded-pill btn-outline-info mx-1">Reject</button>
                                                    <button className="btn rounded-pill btn-outline-info mx-1">Shortlist</button>
                                                    <button className="btn rounded-pill btn-outline-info mx-1">Interview Questions</button>
                                                    <button className="btn rounded-pill btn-outline-info mx-1">View Details</button>


                                                </div>

                                            </div>

                                        </div>
                                    </div>

                                </div>

                            </div>






{/* accordion */}


<div className="accordion" id="accordionExample">
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button bg-black text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
      How dose TalentedXpet Work      </button>
    </h2>
    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div className="accordion-body bg-gray text-white">
      The easiest way to look at how TalentedXpert works are in these three phases: before you hire, finding and engaging talent, doing the work      </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button collapsed bg-black text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
      How do i message a TalentedXpert?      </button>
    </h2>
    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div className="accordion-body bg-gray text-white">
        <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button collapsed bg-black text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
How do i find the perfect TalentedXpert for my needs?      </button>
    </h2>
    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div className="accordion-body bg-gray text-white">
        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
</div>





{/* accourdion end */}







                        </div>
                        {/* secondcardend */}

                    </div>
    )
}

export default Home