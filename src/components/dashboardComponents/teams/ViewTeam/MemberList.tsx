import React, { FC } from 'react'

const MemberList: FC<any> = ({ data, type }) => {
    return (
        <div className='table-responsive mb-3'>
            <table className="table table-dark table-striped">
                <thead>
                    <tr>
                        <th scope="col">Member Name</th>
                        {type === 'invited' &&<th scope="col">Status</th>}
                        {type === 'invited' &&<th>Action</th>}
                        {type !== 'invited' &&<th>Role</th>}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item: any) => {
                        return (
                            <tr key={item?.id}>
                                <td>{item?.profile?.user?.firstName} {item?.profile?.user?.lastName}</td>
                                {type === 'invited' &&<td>{item?.invitationStatus}</td>}
                                {type === 'invited' &&<td><button className='btn btn-info py-1' >Re-invite</button></td>}
                                <td>{item?.profile?.user?.title}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default MemberList