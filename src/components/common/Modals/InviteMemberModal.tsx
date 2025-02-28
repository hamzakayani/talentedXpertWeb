import React, { FC, useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react';
import ModalWrapper from '../ModalWrapper/ModalWrapper'
import apiCall from '@/services/apiCall/apiCall'
import { useRouter } from 'next/navigation'
import { RootState, useAppDispatch } from '@/store/Store'
import { useSelector } from 'react-redux'
import { requests } from '@/services/requests/requests'
import useDebounce from '@/hooks/useDebounce'
import { inviteTeamSchema } from '@/schemas/inviteTeamSchema/inviteTeamSchema';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dataForServer } from '@/models/inviteTeamModel/inviteTeamModel';
import { toast } from 'react-toastify';

type FormSchemaType = z.infer<typeof inviteTeamSchema>

const InviteMemberModal: FC<any> = ({ isOpen, onClose, data }) => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const closeRef = useRef(null)

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [error, setError] = useState<string>('')
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const user = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const dispatch = useAppDispatch()

    useEffect(() => {
        setOpenModal(true)
        // fetchUsers()
    }, [isOpen])

    const { register, handleSubmit, setValue, watch, clearErrors, formState: { errors } } = useForm<FormSchemaType>({
        defaultValues: {
            teamId: data?.id?.toString() || '',
            memberProfileId: '',
        },
        resolver: zodResolver(inviteTeamSchema),
        mode: 'all'
    })

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        const formData = dataForServer(data)
        await apiCall(`${requests.inviteMember}`, formData, 'post', true, dispatch, user, router).then((res: any) => {
            let message: any;
            if (res?.error) {
                message = res?.error?.message;

                if (Array.isArray(message)) {
                    message?.map((msg: string) => toast.error(msg ? msg : 'Something went wrong, please try again'));
                } else {
                    toast.error(message ? message : 'Something went wrong, please try again')
                }

            } else {

                toast.success(res?.data?.message)
                handleClose()

            }
        }).catch(err => {
            console.warn(err)
        })
    }

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const fetchUsers = async (email: string) => {
        setLoading(true);
        try {
            const response = await apiCall(requests.getUserAll + `?profileType=TE&email=${email}`, {}, 'get', false, dispatch, user, router);
            if (response?.error) {
                setError(response?.error?.message)
            } else {
                const formattedUsers = response?.data?.data?.users.map((user: any) => ({
                    ...user,
                    name: `${user.firstName} ${user.lastName}`
                }));
                setUsers(formattedUsers || []);
                setFilteredUsers(formattedUsers || []);
                if(formattedUsers?.length > 0){
                    handleUserClick(formattedUsers[0])
                }
            }
        } catch (err) {
            console.warn(err)
        } finally {
            setLoading(false);
        }
    }

    // useEffect(() => {
    //     if (debouncedSearchQuery) {
    //         setLoading(true);
    //         const filtered = users.filter(user =>
    //             user.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    //         );
    //         setFilteredUsers(filtered);
    //         setLoading(false);
    //     } else {
    //         setFilteredUsers(users);
    //     }
    // }, [debouncedSearchQuery, users]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleUserClick = (user: any) => {
        // if (!selectedUsers.find(u => u.id === user.id)) {
        //     setSelectedUsers(prevUsers => [...prevUsers, user]);
        // }
        setSelectedUsers([user]);
        setValue('memberProfileId', user?.profile[0]?.id?.toString())

        setError('')
        setFilteredUsers([])
        setSearchQuery('');
    };

    const handleRemoveUser = (userId: string) => {
        // setSelectedUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        setSelectedUsers([]);
        setValue('memberProfileId', '')
    };

    const handleClose = () => {
        setOpenModal(false)
        setSearchQuery('')
        setSelectedUsers([])
        onClose()
    }

    return (
        <>
            {openModal &&
                <div className='ad-review'>
                    <ModalWrapper modalId={"InviteMemberModal"} title={'Add New Member'} closeRef={closeRef} handleClose={handleClose}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='mb-3'>
                                <label htmlFor="teamId" className="form-label">Team Name :</label>
                                <input type="text" className="form-control" placeholder="Team Name" value={data?.name} disabled />
                                {errors.teamId &&
                                    <div className="text-danger pt-2">{errors.teamId.message}</div>
                                }
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="teamId" className="form-label">Enter User Email :</label>
                                <input type="text" className="form-control" placeholder="Enter User Email" value={searchQuery} onChange={handleSearch} />
                            </div>
                            {searchQuery !== '' &&
                                <div className='text-end mb-3'>
                                    <button type="button" className="btn btn-info btn-sm rounded-pill" onClick={() => fetchUsers(searchQuery)}>Search</button>
                                </div>
                            }
                            <div className='mb-3'>
                                {/* {searchQuery && (
                                    <ul>
                                        {filteredUsers.length > 0 ?
                                            filteredUsers.map((user: any) => (
                                                <li key={user.id} onClick={() => handleUserClick(user)}>
                                                    {user.email}
                                                </li>
                                            ))
                                            :
                                            <li>No users found</li>
                                        }
                                    </ul>
                                )} */}
                                <table>
                                    {filteredUsers.length > 0 ?
                                        <tbody>
                                            {filteredUsers.map((user: any) => (
                                                <tr key={user.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input me-2"
                                                            onChange={() => handleUserClick(user)}
                                                        />
                                                    </td>
                                                    <td>
                                                        {user.email}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        : error ?
                                            <li>No users found</li>
                                            : null
                                    }
                                </table>
                            </div>
                            <div className='mb-5'>
                                {selectedUsers?.length > 0 &&
                                    <>
                                        <h6>Selected User</h6>
                                        <table className="table table-dark table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">Job Title</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedUsers.map(user => (
                                                    <tr key={user.id}>
                                                        <td>{user?.name}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.title}</td>
                                                        <td><Icon icon="material-symbols:delete-outline" className='cursor' onClick={() => handleRemoveUser(user.id)} /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                }
                                {errors.memberProfileId &&
                                    <div className="text-danger pt-2">{errors.memberProfileId.message}</div>
                                }
                            </div>
                            <div className='text-end'>
                                <button type='button' className="btn rounded-pill btn-outline-info btn-sm me-2 ls" onClick={handleClose}>Cancel</button>
                                <button type="submit" className="btn btn-info btn-sm rounded-pill" disabled={selectedUsers?.length === 0}>Send Invite</button>
                            </div>
                        </form>
                    </ModalWrapper>
                </div>
            }
        </>
    )
}

export default InviteMemberModal