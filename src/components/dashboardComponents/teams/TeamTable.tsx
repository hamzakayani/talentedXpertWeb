import React, { FC, useState } from 'react'
import { Icon } from '@iconify/react';
import NoFound from '@/components/common/NoFound/NoFound';
import InviteMemberModal from '@/components/common/Modals/InviteMemberModal';

const TeamTable: FC<any> = ({ data }) => {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [selectTeam, setSelectTeam] = useState<any>({})

    const handleInvite = (row: any) => {
        setShowModal(true)
        setSelectTeam(row)
    }

    const closeInvite = () => {
        setShowModal(false)
        setSelectTeam({})
    }

    return (
        <div className='mt-3'>
            <table className='table table-responsive'>
                <thead className="table-light">
                    <tr>
                        <th scope="col" className='nr'>Team Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Number of Members</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody className='table-dark'>
                    {data?.length > 0 &&
                        data?.map((row: any) => {
                            return (
                                <tr key={row?.id}>
                                    <td>{row?.name}</td>
                                    <td>{row?.description}</td>
                                    <td>0</td>
                                    <td>
                                        <Icon icon="mdi:eye-outline" className='me-2' id={row?.id} onClick={() => handleInvite(row)} />
                                        <Icon icon="material-symbols:delete-outline" className='' />
                                    </td>
                                </tr>

                            )
                        })
                    }
                    {data?.length === 0 &&
                        <tr>
                            <td colSpan={4}>
                                <NoFound message={"No teams found yet"} />
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
            {showModal && <InviteMemberModal isOpen={showModal} onClose={closeInvite} data={selectTeam} />}
        </div>
    )
}

export default TeamTable