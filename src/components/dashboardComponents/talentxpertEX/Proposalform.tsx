import React from 'react'
import { Icon } from '@iconify/react';


export const Proposalform = () => {
    return (
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light">
                    <h5 className='mb-0'>Proposal Form</h5>
                </div>
                <div className="card-body bg-gray">
                    <div className="card bg-dark">
                        <div className="card-body">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className="mb-3">
                                        <label className="form-label text-light fs-12">Description :</label>
                                        <textarea className="form-control bg-dark-gray border-0" id="exampleFormControlTextarea" rows={6}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Amount :</label>
                                        <input type="text" className="form-control bg-dark-gray border-0 w-50" id="exampleFormControlInput1" placeholder="$20K" />
                                    </div>
                                    <div className='mb-3'>
                                        <label className="form-label text-light fs-12">File Upload :</label>
                                        <div className="d-grid gap-2">
                                            <button className="btn bg-light text-dark fs-12 w-50 rounded-pill" type="button"><Icon icon="uil:upload" className='me-1' /> File Upload</button>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className="card bg-dark-gray mb-3">
                                        <div className="card-body bg-gray">
                                            <h6 className='text-light fw-light ms-4 mb-3'>My Articles</h6>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input bg-transparent border-light" type="checkbox" value="" id="flexCheckDefault" />
                                                <label className="form-check-label text-light fs-14" htmlFor="flexCheckDefault">
                                                    Write headlines with words that resonate
                                                </label>
                                                <div className='border-bottom my-2'></div>
                                                <p className='text-light fs-12'>It makes sense. Audiences are seeking information that will help them in their lives, and they have a lot of ...</p>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input bg-transparent border-light" type="checkbox" value="" id="flexCheckDefault" />
                                                <label className="form-check-label text-light fs-14" htmlFor="flexCheckDefault">
                                                    Focus on clarity for web content
                                                </label>
                                                <div className='border-bottom my-2'></div>
                                                <p className='text-light fs-12'>Explaining your product or service can get cumbersome, but it shouldn’t if you want the audience to quickly understand...</p>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input bg-transparent border-light" type="checkbox" value="" id="flexCheckDefault" />
                                                <label className="form-check-label text-light fs-14" htmlFor="flexCheckDefault">
                                                    Write to win over readers
                                                </label>
                                                <div className='border-bottom my-2'></div>
                                                <p className='text-light fs-12'>This ad for the Content Marketing Institute newsletter works well as a sample of website content writing. By ...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12'>
                                    <h6 className='text-light mb-3'> Interview Questions</h6>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlTextarea1" className="form-label fs-12 text-light mb-1">What is the question-answer relationship strategy?</label>
                                        <textarea className="form-control bg-dark-gray border-0" id="exampleFormControlTextarea1" rows={2}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlTextarea1" className="form-label fs-12 text-light mb-1">What is the question-answer relationship strategy?</label>
                                        <textarea className="form-control bg-dark-gray border-0" id="exampleFormControlTextarea1" rows={2}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlTextarea1" className="form-label fs-12 text-light mb-1">What is the question-answer relationship strategy?</label>
                                        <textarea className="form-control bg-dark-gray border-0" id="exampleFormControlTextarea1" rows={2}></textarea>
                                    </div>
                                    {/* <div className='mb-3'>
                                        <p className='text-light fs-12 mb-1'>What is the question-answer relationship strategy?</p>
                                        <p className='answer-proposal text-light fs-12 mb-0'>aaaaaa</p>
                                    </div> */}
                                </div>
                                <div className='text-end'>
                                    <button className="btn btn-outline-info text-light fs-12 rounded-pill fw-light" type="button"> Submit Proposal</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

    )
}
