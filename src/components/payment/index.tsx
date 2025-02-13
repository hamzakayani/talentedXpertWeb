'use client'
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import Image from 'next/image';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useRouter } from 'next/navigation';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { getTimeago } from '@/services/utils/util';
import FilterCard from '../dashboardComponents/tasks/FilterCard';


const Payment = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [transactions, setTransactions] = useState([])
    const [balance, setBalance] = useState<any>({})
    const user = useSelector((state: RootState) => state.user);


    const getTransactions = async () => {
        await apiCall(requests.transactions, {}, 'get', false, dispatch, user, router)
            .then((res: any) => {
                if (res?.error) {
                    return;
                } else {
                    setTransactions(res?.data?.data?.transactions)
                }
            })
            .catch(err => console.warn(err));
    };

    const getBalance = async () => {
        await apiCall(requests.balance, {}, 'get', false, dispatch, user, router)
            .then((res: any) => {
                if (res?.error) {
                    return;
                } else {
                    setBalance(res?.data?.data?.balance)

                }
            })
            .catch(err => console.warn(err));
    };

    useEffect(() => {
        getTransactions()
        getBalance()

    }, [])

    console.log('tt', transactions, balance?.available)
    return (
        <div className='card'>
            {user?.profile[0]?.type == 'TE' && <div className='walletscreen Top-card d-flex justify-content-between pb-2'>
                <div className='card bg-dark text-white px-4 py-2'>
                    <h3>Pending Balance</h3>
                    {balance?.pending?.length > 0 && <span>$ {balance?.pending[0]?.amount / 100}</span>}
                </div>
                <div className='card bg-dark text-white px-4 py-2'>
                    <h3>Available Soon Balance</h3>
                    {balance?.instant_available?.length > 0 && <span>${balance?.instant_available[0]?.amount / 100}</span>}
                </div>
                <div className='card bg-dark text-white px-4 py-2'>
                    <h3>Available Balance</h3>
                    {balance?.available?.length > 0 && <span>$  {balance?.available[0]?.amount / 100}</span>}
                </div>
                {/* <div className='card bg-dark text-white px-4 py-2'>
                    <h3>Received Balance</h3>
                    <span>$</span>
                </div> */}
            </div>}
            <div className='tab-card first-card card-header  '>
                <div className="card-header bg-dark text-light">
                    <h5 className='mb-0'>Transactions</h5>
                </div>

                {/* <ul className="nav nav-pills mt-3" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active " id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Payment</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Wallet</button>
                    </li>
                    <li className="nav-item mb-2" role="presentation">
                        <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Balance</button>
                    </li>
                </ul> */}
                <div className='filtersearch d-flex align-items-center justify-content-between flex-wrap p-2'>
                    <div className='filters d-flex align-items-center '>
                        <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example" >

                            <option value={''} >Select</option>



                        </select>
                    </div>

                </div>

                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                        <div className='Table table-responsive'>
                            <table className="table ">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className='nr'>PAID BY</th>
                                        <th scope="col">PAID TO</th>
                                        <th scope="col">Task Name</th>
                                        <th scope="col">MIlestone Title</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Date</th>
                                        {/* <th scope="col">BALANCE</th> */}
                                        <th scope="col">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions?.map((trans: any) => (<tr className='table-dark' key={trans?.id}>
                                        <th scope="row">{trans?.senderProfile?.user?.firstName} {trans?.senderProfile?.user?.lastName}</th>
                                        <td>{trans?.receiverProfile?.user?.firstName} {trans?.receiverProfile?.user?.lastName}</td>
                                        <td>{trans?.task?.name}</td>
                                        <td>{''}</td>
                                        <td>{trans?.netAmount}</td>
                                        <td>{new Date(trans?.createdAt).toISOString().split("T")[0]}</td>
                                        <td>{trans?.status}</td>
                                    </tr>))}

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

            <div className='pagiandnumber d-flex flex-wrap justify-content-around justify-content-md-between align-items-baseline py-2 px-lg-5 px-2 bg-black'>
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
