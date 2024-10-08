import React from 'react'
import { Icon } from '@iconify/react';


const Newarticle = () => {
    return (
     
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light">
                    <h5 className='mb-0'>Add New Article</h5>
                </div>
                <div className="card-body bg-gray">
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Title</label>
                                <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Title" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-light fs-12">Category</label>
                                <select className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                    <option selected>Select category</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div className='mb-3'>
                                <label className="form-label text-light fs-12">Description</label>
                                <div className="card border-0">
                                    <div className="card-header bg-dark-gray text-light">
                                        <p className='mb-0 fs-12 text-light'> package will be used here for this area </p>
                                    </div>
                                    <div className="card-body bg-dark p-0">
                                        <textarea className="form-control bg-dark border-0" id="exampleFormControlTextarea1" rows={6}></textarea>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Tags</label>
                                <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Add Tags" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-light fs-12">Related Items</label>
                                <select className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                    <option selected>Select related items</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Name</label>
                                <input type="text" className="form-control bg-dark border-0" id="exampleFormControlInput1" placeholder="Name" />
                                <button type="button" className="btn btn-info btn-sm position-absolute article-btn">Browse</button>
                            </div>
                            <div className='mb-3'>
                                <div className='table-responsive'>
                                    <table className="table table-dark table-striped">
                                        <thead>
                                            <tr className='fs-12 fw-small'>
                                                <th scope="col">Document Name</th>
                                                <th scope="col">File</th>
                                                <th scope="col">Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className='fs-12'>
                                                <td>my web dev courses</td>
                                                <td><Icon icon="bx:file" className='ms-2' /></td>
                                                <td><Icon icon="material-symbols:delete-outline" className='ms-3' /></td>
                                            </tr>
                                            <tr className='fs-12'>
                                                <td>my web dev courses</td>
                                                <td><Icon icon="bx:file" className='ms-2' /></td>
                                                <td><Icon icon="material-symbols:delete-outline" className='ms-3' /></td>
                                            </tr>
                                            <tr className='fs-12'>
                                                <td>my web dev courses</td>
                                                <td><Icon icon="bx:file" className='ms-2' /></td>
                                                <td><Icon icon="material-symbols:delete-outline" className='ms-3' /></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>
                        <div className='col-12 text-end'>
                            <button type="button" className="btn btn-info btn-sm rounded-pill">Submit</button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Newarticle