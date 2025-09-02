'use client'
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import Image from 'next/image';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/Store';
import { useRouter } from 'next/navigation';
import DisputeModal from '../common/Modals/DisputeModal';
import ImageFallback from '../common/ImageFallback/ImageFallback';
import defaultUserImg from "../../../public/assets/images/default-user.jpg"
import Link from 'next/link';
import NoFound from '../common/NoFound/NoFound';
import { useNavigation } from '@/hooks/useNavigation';
import { toast } from 'react-toastify';

const Dispute = () => {
  const user = useSelector((state: RootState) => state.user);
  const { navigate } = useNavigation()
  const [dispute, setDispute] = useState<any>([])
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const getdisputes = async () => {
    try {
      const response = await apiCall(requests?.dispute, {}, 'get', false, dispatch, user, router);
      setDispute(response?.data?.data?.disputes || []);
    } catch (error) {
      console.warn("Error fetching tasks:", error);
    }
  }

  const handleWithdrawDispute = async () => {
    if (!selectedDispute) return;
    
    try {
      const response = await apiCall(
        requests?.dispute +"/"+ selectedDispute.id,
        { status: "WITHDRAW" },
        'patch',
        false,
        dispatch,
        user,
        router
      );
      
      if (response?.error) {
        toast.error(response?.error?.message || "Failed to withdraw dispute");
      } else {
        toast.success("Dispute withdrawn successfully");
        setShowWithdrawModal(false);
        setSelectedDispute(null);
        getdisputes(); // Refresh the disputes list
      }
    } catch (error) {
      console.warn("Error withdrawing dispute:", error);
      toast.error("Failed to withdraw dispute");
    }
  }

  const openWithdrawModal = (disputeData: any) => {
    setSelectedDispute(disputeData);
    setShowWithdrawModal(true);
  }

  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
    setSelectedDispute(null);
  }

  useEffect(() => {

    getdisputes()

  }, [])

  return (
    <div>
      <div className='card'>
        <div className='first-card card-header d-lg-flex d-md-flex d-sm-flex justify-content-between px-4 bg-gray'>
          <div className='card-left-heading'>
            <h3>Disputes</h3>
          </div>
          <div className='card-right-heading d-flex justify-content-between bg-info dispute-btn card-right-heading bg-info text-white  d-flex justify-content-between add-new ' data-bs-target="#exampleModalToggle11" data-bs-toggle="modal">
            <span className=''>Add New Dispute </span>
            <Icon icon="line-md:plus-square-filled" className='text-black' width={32} height={32} />
          </div>
        </div>
        {dispute?.length > 0 ? (
          <div className='card-bodyy my-active-task py-1 '>

            {dispute.map((data: any, index: number) => {
              if (data) {
                return (
                  <>
                    {data?.task && data?.task?.requesterProfile && data?.task?.proposals[0]?.expertProfile?.user ? (
                      <div className="box mx-3 my-2" key={index}>
                        <div className="row mx-3">
                          <div className="col-auto ms-0 ps-0">
                            <div className="text-lg-end card-profile mt-4">
                              <div className="text-lg-end">
                                <ImageFallback
                                  src={
                                    data?.createdByUser.profilePicture?.fileUrl
                                  }
                                  alt="img"
                                  className="img-fluid user-img img-round"
                                  width={60}
                                  height={60}
                                  priority
                                  userName={data?.createdByUser?.firstName + ' ' + data?.createdByUser?.lastName}

                                />
                                <h2>
                                  {`${data?.createdByUser?.firstName} ${data?.createdByUser?.lastName}`}
                                </h2>
                              </div>
                            </div>
                          </div>
                          <div className="col pe-4">
                            <div className="priceanddate d-flex justify-content-between bordr">
                              <div className="d-flex flex-wrap align-items-baseline">
                                <h4>{data?.task?.name}</h4>
                              </div>
                              <div className="">
                                <button className={`btn ls mt-1 me-2 me-lg-0 ${data?.status === "WITHDRAW" ? "btn-warning" : "btn-danger"}`}>
                                  {data?.status === "WITHDRAW" ? "WITHDRAWN" : data?.status}
                                </button>
                              </div>

                              <div className="pricedate text-lg-end">
                                <span>2 days ago</span>
                                <h5>$ {data?.task?.amount} / hr</h5>
                              </div>
                            </div>
                            <p className="text-white mt-3  truncate-overflow">{data?.description}</p>
                            {data?.documents?.map((doc: any) => (
                              <div key={doc.fileUrl}>
                                <Link href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                  {doc.key}
                                </Link>
                              </div>
                            ))}
                          </div>

                        </div>


                        <div className="card-footer d-flex flex-wrap justify-content-end pb-4">
                          {data?.createdByUser?.id === user?.id  && data?.status !== "WITHDRAW" && (
                            <button 
                              className="btn rounded-pill btn-outline-danger btn-sm mt-2 me-2" 
                              onClick={() => openWithdrawModal(data)}
                            >
                              Withdraw Dispute
                            </button>
                          )}
                          <Link className="btn rounded-pill btn-outline-info btn-sm mt-2" href={`/dashboard/disputes/${data.id}`} onClick={() => navigate(`/dashboard/disputes/${data.id}`)}>
                            View Details<Icon icon="ic:sharp-arrow-forward" className='ms-2' />
                          </Link>
                        </div>

                      </div>
                    ) : ('')}
                  </>
                );
              }

            })}

          </div>

        ) : (
          <NoFound message={'No disputes available'} />
        )
        }
      </div>
      <DisputeModal type={true} getdisputes={getdisputes} />
      
      {/* Withdrawal Confirmation Modal */}
      {showWithdrawModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex={-1} aria-labelledby="withdrawModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="withdrawModalLabel">
                  Confirm Withdrawal
                </h5>
                <button type="button" className="btn-close" onClick={closeWithdrawModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to withdraw this dispute?</p>
                <p className="text-muted small">
                  <strong>Task:</strong> {selectedDispute?.task?.name}<br/>
                  <strong>Dispute ID:</strong> {selectedDispute?.id}
                </p>
                <p className="text-warning">
                  <strong>Note:</strong> This action cannot be undone. Once withdrawn, the dispute will be marked as resolved.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary rounded-pill" onClick={closeWithdrawModal}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-pill"
                  onClick={handleWithdrawDispute}
                >
                  Withdraw Dispute
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showWithdrawModal && <div className="modal-backdrop fade show"></div>}
    </div >
  )
}

export default Dispute
