import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

const ChatHeader = ({user, thread}:any) => {
  return (
    <div className="ChatHead">
                                        <li className="group">
                                            <div className="avatar"><img src="imgs/Asset 1.svg" alt="" /></div>
                                            <p className="GroupName text-white mb-0">{user?.profile[0]?.type === 'TR' ? thread?.expertProfile?.user?.firstName : thread?.task?.requesterProfile?.user?.firstName} {user?.profile[0].type === 'TR' ? thread?.expertProfile?.user?.lastName : thread?.task?.requesterProfile?.user?.lastName}</p>
    
                                        </li>
                                        <div className="callGroupicon d-flex align-items-center">
                                            <div className="search-boxx">
                                                <button className="btn-search">
                                                    <Icon className='text-info m-1' icon="weui:search-outlined" />
                                                </button>
                                                <input type="text" className="input-search" placeholder="Type to Search..." />
                                            </div>
                                            <Icon className='text-info m-1 fs-24' icon="material-symbols-light:call-outline-sharp" />
                                            <Icon className='text-info m-1 fs-24' icon="carbon:video" />
                                            <Icon className='text-info m-1 fs-24' icon="mage:dots" />
                                        </div>
                                    </div>
  )
}

export default ChatHeader
