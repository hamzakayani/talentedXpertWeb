'use client'
import { useFetchDisputePolicy } from '@/hooks/disputes/useDisputes'
import React from 'react'
import GlobalLoader from '../common/GlobalLoader/GlobalLoader';
import HtmlData from '../common/HtmlData/HtmlData';

const DisputePolicies = () => {
    const fetchDisputePolicy = useFetchDisputePolicy();

    if (fetchDisputePolicy.isLoading) {
        return <GlobalLoader />;
    }

    if (fetchDisputePolicy.error) {
        return (
            <section className="herosection forpadding pb-5">
                <div className="container">
                    <div className="text-center py-5">
                        <h2 className="text-danger">Error loading dispute policies</h2>
                        <p className="text-muted">Please try again later.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="herosection forpadding pb-5">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7 mx-auto">
                        <div className="card shadow-sm border-0 rounded-3 mb-5">
                            <div className="card-body p-4">
                                <h1 className="text-center mb-4 text-black">Dispute Policies</h1>
                                <h2 className="mb-4">{fetchDisputePolicy?.data?.data?.policies?.[0]?.title || ''}</h2>
                                <HtmlData
                                    data={fetchDisputePolicy?.data?.data?.policies?.[0]?.content || 'No content found yet'}
<<<<<<< HEAD
                                    className="text-muted mb-4"
                                    isDark
=======
                                    className="blackparagraphs text-muted mb-4"
>>>>>>> 9ee3ab199e5916a7af590e17409d3be8f19df273
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DisputePolicies
