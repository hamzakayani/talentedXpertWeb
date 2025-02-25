import React, { useState } from 'react'
import { Icon } from '@iconify/react';

const TeamTable = () => {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [selectTeam, setSelectTeam] = useState<any>({})

    const handleInvite = (row:any) => {
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
                    <tr>
                        <td>Team 1</td>
                        <td>Team 1</td>
                        <td>3</td>
                        <td>
                            <Icon icon="material-symbols:delete-outline" className='ms-3' />
                        </td>
                    </tr>
                    <tr>
                        <td>Team 2</td>
                        <td>Team 1</td>
                        <td>5</td>
                        <td>
                            delete, edit
                        </td>
                    </tr>
                    <tr>
                        <td>Team 3</td>
                        <td>Team 1</td>
                        <td>2</td>
                        <td>
                            delete, edit
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default TeamTable