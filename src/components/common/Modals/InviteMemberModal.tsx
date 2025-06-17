import React, { FC, useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import apiCall from '@/services/apiCall/apiCall';
import { useRouter } from 'next/navigation';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { requests } from '@/services/requests/requests';
import useDebounce from '@/hooks/useDebounce';
import { inviteTeamSchema } from '@/schemas/inviteTeamSchema/inviteTeamSchema';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dataForServer } from '@/models/inviteTeamModel/inviteTeamModel';
import { toast } from 'react-toastify';

// Define types for search query and user
interface SearchQuery {
    firstName: string;
    lastName: string;
    jobTitle: string;
    industry: string;
    location: string;
    email: string;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle?: string;
    industry?: string;
    location?: string;
    profile: { id: string }[];
}

type FormSchemaType = z.infer<typeof inviteTeamSchema>;

const InviteMemberModal: FC<{ isOpen: boolean; onClose: () => void; data: { id: string; name: string } }> = ({
    isOpen,
    onClose,
    data,
}) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const closeRef = useRef(null);

    // Search query state
    const [searchQuery, setSearchQuery] = useState<SearchQuery>({
        firstName: '',
        lastName: '',
        jobTitle: '',
        industry: '',
        location: '',
        email: '',
    });
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [error, setError] = useState<string>('');
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const user = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const dispatch = useAppDispatch();


    useEffect(() => {
        setOpenModal(isOpen);
    }, [isOpen]);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormSchemaType>({
        defaultValues: {
            teamId: data?.id?.toString() || '',
            memberProfileId: '',
        },
        resolver: zodResolver(inviteTeamSchema),
        mode: 'all',
    });

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        const formData = dataForServer(data);
        try {
            const res = await apiCall(
                `${requests.inviteMember}`,
                formData,
                'post',
                true,
                dispatch,
                user,
                router
            );
            if (res?.error) {
                const message = res?.error?.message;
                if (Array.isArray(message)) {
                    message.forEach((msg: string) => toast.error(msg || 'Something went wrong'));
                } else {
                    toast.error(message || 'Something went wrong');
                }
            } else {
                toast.success(res?.data?.message);
                handleClose();
            }
        } catch (err) {
            console.warn(err);
            toast.error('Failed to send invite');
        }
    };

    const fetchUsers = async () => {
        // Validate email format if provided
        if (searchQuery.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchQuery.email)) {
            setError('Invalid email format');
            return;
        }
        // Require at least one search field
        const hasQuery = Object.values(searchQuery).some((value) => value.trim() !== '');
        if (!hasQuery) {
            setError('Please enter at least one search criterion.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Construct query parameters
            const query = new URLSearchParams();
            Object.entries(searchQuery).forEach(([key, value]) => {
                if (value.trim()) {
                    query.append(key, value.trim());
                }
            });
            const response = await apiCall(
                `${requests.connectedAccount}?${query.toString()}`,
                {},
                'get',
                false,
                dispatch,
                user,
                router
            );
            if (response?.error) {
                setError(response?.error?.message || 'Failed to fetch users');
                setFilteredUsers([]);
            } else {
                const users = Array.isArray(response?.data?.data?.user)
                    ? response?.data?.data?.user
                    : [response?.data?.data?.user].filter(Boolean);
                const validUsers = users.filter((u: User) => u.id !== user?.id);
                setFilteredUsers(validUsers);
                if (validUsers.length === 0 && users.length > 0) {
                    setError('You cannot invite yourself.');
                }
            }
        } catch (err) {
            console.warn(err);
            setError('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchQuery((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleUserClick = (user: User) => {
        setSelectedUsers([user]); // Single selection
        setValue('memberProfileId', user?.profile?.[0]?.id?.toString() || '');
        setFilteredUsers([]);
        setSearchQuery({
            firstName: '',
            lastName: '',
            jobTitle: '',
            industry: '',
            location: '',
            email: '',
        });
    };

    const handleRemoveUser = (userId: string) => {
        setSelectedUsers([]);
        setValue('memberProfileId', '');
    };

    const handleClose = () => {
        setOpenModal(false);
        setSearchQuery({
            firstName: '',
            lastName: '',
            jobTitle: '',
            industry: '',
            location: '',
            email: '',
        });
        setSelectedUsers([]);
        setFilteredUsers([]);
        setError('');
        onClose();
    };

    return (
        <>
            {openModal && (
                <div className="ad-review">
                    <ModalWrapper
                        modalId="InviteMemberModal"
                        title="Add New Member"
                        closeRef={closeRef}
                        handleClose={handleClose}
                    >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <h6 className="form-label">Search Users:</h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="firstName" className="form-label">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            className="form-control"
                                            placeholder="Enter First Name"
                                            value={searchQuery.firstName}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="lastName" className="form-label">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            className="form-control"
                                            placeholder="Enter Last Name"
                                            value={searchQuery.lastName}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            id="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Enter Email"
                                            value={searchQuery.email}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="jobTitle" className="form-label">
                                            Job Title
                                        </label>
                                        <input
                                            type="text"
                                            id="jobTitle"
                                            name="jobTitle"
                                            className="form-control"
                                            placeholder="Enter Job Title"
                                            value={searchQuery.jobTitle}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="industry" className="form-label">
                                            Industry
                                        </label>
                                        <input
                                            type="text"
                                            id="industry"
                                            name="industry"
                                            className="form-control"
                                            placeholder="Enter Industry"
                                            value={searchQuery.industry}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="location" className="form-label">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            className="form-control"
                                            placeholder="Enter Location"
                                            value={searchQuery.location}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                </div>
                                {error && <div className="text-danger pt-2">{error}</div>}
                                <div className="text-end mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-info btn-sm rounded-pill"
                                        onClick={fetchUsers}
                                        disabled={loading}
                                    >
                                        {loading ? 'Searching...' : 'Search'}
                                    </button>
                                </div>
                            </div>
                           

                            {/* Search Results */}
                            {filteredUsers.length > 0 && (
                                <div className="mb-3">
                                    <h6>Search Results</h6>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Select</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">Job Title</th>
                                                    <th scope="col">Industry</th>
                                                    <th scope="col">Location</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUsers.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={selectedUsers.some((u) => u.id === user.id)}
                                                                onChange={() => handleUserClick(user)}
                                                            />
                                                        </td>
                                                        <td>{`${user.firstName} ${user.lastName}`}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.jobTitle || '-'}</td>
                                                        <td>{user.industry || '-'}</td>
                                                        <td>{user.location || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            {filteredUsers.length === 0 &&
                                Object.values(searchQuery).some((q) => q.trim()) &&
                                !loading &&
                                !error && (
                                    <div className="mb-3">No users found.</div>
                                )}

                            {/* Selected Users */}
                            {selectedUsers.length > 0 && (
                                <div className="mb-5">
                                    <h6>Selected Users</h6>
                                    <div className="table-responsive">
                                        <table className="table table-dark table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">Job Title</th>
                                                    <th scope="col">Industry</th>
                                                    <th scope="col">Location</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedUsers.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>{`${user.firstName} ${user.lastName}`}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.jobTitle || '-'}</td>
                                                        <td>{user.industry || '-'}</td>
                                                        <td>{user.location || '-'}</td>
                                                        <td>
                                                            <Icon
                                                                icon="material-symbols:delete-outline"
                                                                className="cursor-pointer"
                                                                onClick={() => handleRemoveUser(user.id)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {errors.memberProfileId && (
                                        <div className="text-danger pt-2">{errors.memberProfileId.message}</div>
                                    )}
                                </div>
                            )}
                            <div className="text-end">
                                <button
                                    type="button"
                                    className="btn btn-outline-info btn-sm rounded-pill me-2"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-info btn-sm rounded-pill"
                                    disabled={selectedUsers.length === 0}
                                >
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </ModalWrapper>
                </div>
            )}
        </>
    );
};

export default InviteMemberModal;