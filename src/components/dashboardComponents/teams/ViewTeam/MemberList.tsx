import React, { FC } from 'react'

const MemberList: FC<any> = ({ data, type }) => {
    return (
        <div className='table-responsive mb-3'>
            <table className="table table-dark table-striped">
                <thead>
                    <tr>
                        <th scope="col">Member Name</th>
                        {type === 'invited' && <th scope="col">Status</th>}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item: any) => {
                        return (
                            <tr key={item?.id}>
                                <td>{item?.profile?.user?.firstName} {item?.profile?.user?.lastName}</td>
                                {type === 'invited' && <td>{item?.invitationStatus}</td>}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default MemberList