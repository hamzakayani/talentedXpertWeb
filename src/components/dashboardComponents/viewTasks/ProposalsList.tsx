'use client'
import { useFetchAllProposals, useFindTopProposal } from '@/hooks/proposals/useProposal';
import { useParams, usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { Icon } from "@iconify/react";
import SearchFilter from '../SearchFilter/SearchFilter';
import ProposalTabs from '../Tabs/ProposalTabs';
import { toast } from 'react-toastify';
import SpinnerLoader from '@/components/common/GlobalLoader/SpinnerLoader';
import NoFound from '@/components/common/NoFound/NoFound';
import ProposalCard from '@/components/common/cards/ProposalCard';

const ProposalsList = () => {
    const { id } = useParams();
    const pathname = usePathname();
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [status, setStatus] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [rating, setRating] = useState<string>("");
    const [budget, setBudget] = useState<string>("");
    const [amountType, setAmountType] = useState<string>("");
    const [shortlisted, setShortlisted] = useState<boolean>(false);

    const [openRp, setOpenRp] = useState<boolean>(false)

    const topProposalMutation = useFindTopProposal()

    const fetchProposals = useFetchAllProposals({params: {
        ...(id && Number(id) > 0 && {taskId: Number(id)}),
        ...(status && status !== "AI Recommendation" && { status }),
        ...(rating && { rating }),
        ...(amountType && { amountType }),
        ...(budget && { budget }),
        ...(searchQuery.trim() && { search: searchQuery.trim()}),
        ...(shortlisted && { shortlisted }),
    }, enabled: true})

    const onPageChange = (page: number) => {
        setPage(page);
    };

    const onLimitChange = (limit: number) => {
        setLimit(limit);
        setPage(1)
    };

    const handlechange = (value: string) => {
        setStatus(value);
        if(value === "AI Recommendation"){
            getTopProposals();
        }
    };

    const getTopProposals = async () => {
        if(fetchProposals?.data?.data?.proposals?.length > 0){
            const data = {
                job_description: fetchProposals?.data?.data?.proposals?.[0]?.task?.details,
                proposals: Object.fromEntries(
                    fetchProposals?.data?.data?.proposals?.map((prop:any) => [ prop?.id, prop?.details]) || []
                )
            }
            try {
                const response = await topProposalMutation.mutateAsync(
                  data
                );

                if(response?.data?.data?.top_proposal){
                    const sortedProposalIds = response?.data?.data?.top_proposal

                    fetchProposals?.data?.data?.proposals?.sort((a:any, b:any) =>{
                        return (
                            sortedProposalIds.indexOf(a.id) - sortedProposalIds.indexOf(b.id)
                        )
                    })
                }
            } catch (error) {
                console.warn("Error fetching tasks:", error);
            }
        } else {
            toast.error("No proposals exits");
        }
    }

    return (
        <div className={`mt-3 ${pathname?.includes('dashboard') ? 'bg_neutral_800' : 'bg-light'}`}
            style={{
              border: "1px solid var(--color_grey)",
              borderRadius: 12,
              overflow: "hidden",
            }}
        >
            <button
                type="button"
                className={`w-100 d-flex justify-content-between align-items-center p-3 text-start ${pathname?.includes('dashboard') ? 'bg_neutral_800' : 'bg-light'}`}
                onClick={() => setOpenRp(!openRp)}
                aria-expanded={openRp}
                style={{
                    color: pathname?.includes('dashboard') ? "var(--color_tertiary)" : 'var(--color_black)',
                    border: "none",
                    width: "100%",
                    maxWidth: "100%",
                    height: 43,
                    borderRadius: 8,
                    opacity: 1,
                    background: "#333333",
                }}
            >
                <p className="m-0 fw-medium">Received Proposals</p>
                <Icon
                    icon="mdi:chevron-down"
                    style={{
                        transition: "transform 200ms ease",
                        transform: openRp ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                />
            </button>
            {openRp && (
                <div className='p-3'>
                    {/* Search Filters */}
                    <SearchFilter
                        title={'Recieved Proposals'}
                        onSearch={(q) => setSearchQuery(q)} 
                        search={searchQuery}
                        hideFilters={true}
                        isDashboard={pathname?.includes('dashboard') ? true : false}
                        placeholder="Search proposal, talentedxpert"
                    />
                    <div className={`d-flex ${pathname?.includes('dashboard') ? 'justify-content-between' : 'justify-content-end'} gap-2 mb-3 flex-wrap`}>
                        <div className="order-1 order-md-2">
                            <ProposalTabs activeTab={status || ''} onClick={handlechange} />
                        </div>
                        <div className={`d-flex gap-2 align-items-start mb-md-2 mb-0 order-2 order-md-1`}>
                            <select 
                                className={`form-select rounded-5 bg-transparent ${pathname?.includes('dashboard') ? "text-white" : "text-black border-black"}`}
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                            >
                                <option value={''}>Rating</option>
                                <option value={'3'}>3 Stars</option>
                                <option value={'4'}>4 Stars</option>
                                <option value={'5'}>5 Stars</option>
                            </select>
                            <select 
                                className={`form-select rounded-5 bg-transparent ${pathname?.includes('dashboard') ? "text-white" : "text-black border-black"}`}
                                onChange={(e) => setBudget(e.target.value)}
                                value={budget}
                            >
                                <option value="">Budget</option>
                                <option value="999">Less than $1000</option>
                                <option value="4999">Less than $5000</option>
                                <option value="9999">Less than $10000</option>
                                <option value="10000">10,000 or above</option>
                            </select>
                            <select
                                className={`form-select rounded-5 bg-transparent ${pathname?.includes('dashboard') ? "text-white" : "text-black border-black"}`}
                                onChange={(e) => setAmountType(e.target.value)}
                                value={amountType}
                            >
                                <option value="">Amount</option>
                                <option value="FIXED">Fixed</option>
                                <option value="HOURLY">Hourly</option>
                            </select>
                        </div>
                    </div>
                    {/* Proposal Users Cards */}
                    <div className="row row-gap-4 my-3">
                        {(fetchProposals?.isLoading || topProposalMutation?.isPending) ?
                            <SpinnerLoader />
                            : (!fetchProposals?.isLoading || !topProposalMutation?.isPending) && (fetchProposals?.data?.data?.proposals?.length > 0) ? 
                                fetchProposals?.data?.data?.proposals?.map((proposal:any) =>{
                                    return (
                                        <div className='col-md-6' key={proposal?.id}>
                                            <ProposalCard data={proposal} isDark={true} btn={"View Details"} isDashboard={true} />
                                        </div>
                                    )
                                })
                                : (!fetchProposals?.isLoading || !topProposalMutation?.isPending) && (fetchProposals?.data?.data?.proposals?.length === 0)
                                && <NoFound className={"col-12 text-center"} message="No tasks found" />
                        }
                    </div>
                </div>
            )}          
        </div>
    )
}

export default ProposalsList