import React from 'react'
import { Icon } from '@iconify/react';
import Image from 'next/image';

const Payment = () => {
    return (
        <div className='card'>
            <div className='tab-card first-card card-header  '>

                <ul className="nav nav-pills mt-3" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active " id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Payment</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Wallet</button>
                    </li>
                    <li className="nav-item mb-2" role="presentation">
                        <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Balance</button>
                    </li>
                </ul>

                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                        <div className='Table table-responsive'>
                            <table className="table ">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className='nr'>Serial Number</th>
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

                <div className='card-right-heading d-flex justify-content-between'>

                </div>

            </div>

            <div className='pagiandnumber d-flex justify-content-between align-items-baseline mt-3 px-lg-5 px-2 bg-black'>
                <div className='Numbring d-flex align-items-center'>
                    <span>Show</span>
                    <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example">
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
    )
}

export default Payment
