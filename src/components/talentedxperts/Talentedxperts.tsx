'use client'
import React, { FC, useEffect, useState } from 'react'
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/Store';
import { useParams, useRouter } from 'next/navigation';
import FilterCard from '../dashboardComponents/tasks/FilterCard';
import { Pagination } from '../common/Pagination/Pagination';
import InviteModal from '../common/Modals/inviteModal';
import UsersCard from './UsersCard';

const Talentedxperts: FC<any> = ({ isDashboard }) => {
    const { userType } = useParams()
    const user = useSelector((state: RootState) => state.user)
    const [users, setUsers] = useState<any>([])
     const [userId, setUserId ]= useState<any>()
    const [limit, setLimit] = useState<number>(12)
    const [page, setPage] = useState<number>(1)
    const [filters, setFilters] = useState<string>('')
    const [status, setStatus] = useState<string>('')
    const [disability, setDisability] = useState<boolean>(false)
    const [promoted, setPromoted] = useState<boolean>(false)
    const [amountType, setAmountType] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    const dispatch = useAppDispatch();
    const router = useRouter()
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => {
        if (filters && filters != "") {
            getUserDetails(filters);
        }
    }, [filters])

    useEffect(() => {
        setFilterParams();
    }, [limit, status, promoted, amountType, disability, search])

    const getUserDetails = async (params: any) => {
        await apiCall(`${requests.getUserAll}${params}`, {}, 'get', false, dispatch, user, router).then((res: any) => {
            if (res?.error) {
                console.warn(res?.error)
            } else {
                setUsers(res?.data?.data)
            }
        }).catch(err => console.warn(err))
    }

    const setFilterParams = () => {
        let filters = "";

        filters += '?page=' + 1 || '';
        // user ? filters += '&profileType=' + `${user?.profile?.length > 0 && user?.profile[0]?.type}` : ''
        filters += limit > 0 ? '&limit=' + limit : '';
        filters += status != '' ? '&status=' + status : '';
        // filters += disability? '&disability=' + disability : '';
        // filters += promoted? '&promoted=' + promoted : '';
        // filters += amountType != '' ? '&amountType=' + amountType : '';
        filters += search != '' ? '&name=' + search : '';

        setPage(1)
        setFilters(filters)
    }

    const onPageChange = (page: number) => {
        setPage(page)
        let filters = ""

        filters += page > 0 ? '?page=' + page : '';
        filters += limit > 0 ? '&limit=' + limit : '';

        setFilters(filters)
    }

    const onLimitChange = (limit: number) => {
        setLimit(limit);
    };

    return (
        <>
            <div className={`card ${!isDashboard && 'forpadding'}`}>
                <div className='card first-card card-header'>
                    <div className='card-left-heading'>
                        <h3>{userType === 'talent-requestors' ? 'Talent Requestors' : 'Talented Xperts'}</h3>
                    </div>
                </div>
                <FilterCard setPromoted={setPromoted} promoted={promoted} disability={disability} setDisability={setDisability} setAmountType={setAmountType} resetFilters={status} setSearch={setSearch} />
                <div className='card-bodyy my-active-task py-1 ps-2 pe-4 '>
                    <div className='row'>
                        {users?.users?.map((use: any) => <UsersCard key={use?.id} use={use} userType={userType} user={user} setUserId={setUserId} />)}
                    </div>
                    {/* <div className='d-flex justify-content-end my-3'>
                        <Link className="btn rounded-pill btn-outline-info mt-2 btn-sm " href={''} >View All</Link>
                    </div> */}
                </div>
                <InviteModal userId={userId}/>
            </div>
            {users?.count > 0 && <Pagination count={users?.count} page={page} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} siblingCount={1} />}
        </>
    )
}

export default Talentedxperts
