import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';

const Message = () => {
    return (

        <div className='card'>
            <div className='card first-card card-header'>
                <h3>Message</h3>
            </div>


            <div className='card-bodyy my-active-task py-2 '>


                <div className='row'>
                    <div className='col-md-4'>

                        <div className='card bg-gray mt-3 ms-3 p-3 chat-left-card'>
                            <div className="searchBar">
                                <form className="search-container">
                                    <input type="text" className='text-light' id="search-bar" placeholder="Search here" />
                                    <a href="#"> <Icon className='search-icon' icon="clarity:search-line" /> </a>
                                </form>
                            </div>
                            <div className='chat-member'>
                                <ul>
                                    <li className="group d-flex bordr">
                                        <div className="avatar">
                                            <Image
                                                src="/assets/images/profile-img.png"
                                                alt="img"
                                                className="img-fluid user-img img-round"
                                                width={40}
                                                height={40}
                                                priority
                                            />
                                        </div>
                                        <div className='namedescription'>
                                            <p className="GroupName">John smith</p>
                                            <p className="GroupDescrp">Wordpress Developer</p>
                                        </div>
                                        <div className='progres'>
                                            <p>In Progress</p>
                                        </div>
                                    </li>
                                    <li className="group d-flex bordr">
                                        <div className="avatar">
                                            <Image
                                                src="/assets/images/profile-img.png"
                                                alt="img"
                                                className="img-fluid user-img img-round"
                                                width={40}
                                                height={40}
                                                priority
                                            />
                                        </div>
                                        <div className='namedescription'>
                                            <p className="GroupName">John smith</p>
                                            <p className="GroupDescrp">Wordpress Developer</p>
                                        </div>
                                        <div className='progres'>
                                            <p>In Progress</p>
                                        </div>
                                    </li>
                                    <li className="group d-flex bordr">
                                        <div className="avatar">
                                            <Image
                                                src="/assets/images/profile-img.png"
                                                alt="img"
                                                className="img-fluid user-img img-round"
                                                width={40}
                                                height={40}
                                                priority
                                            />
                                        </div>
                                        <div className='namedescription'>
                                            <p className="GroupName">John smith</p>
                                            <p className="GroupDescrp">Wordpress Developer</p>
                                        </div>
                                        <div className='progres'>
                                            <p>In Progress</p>
                                        </div>
                                    </li>
                                    <li className="group d-flex bordr">
                                        <div className="avatar">
                                            <Image
                                                src="/assets/images/profile-img.png"
                                                alt="img"
                                                className="img-fluid user-img img-round"
                                                width={40}
                                                height={40}
                                                priority
                                            />
                                        </div>
                                        <div className='namedescription'>
                                            <p className="GroupName">John smith</p>
                                            <p className="GroupDescrp">Wordpress Developer</p>
                                        </div>
                                        <div className='progres'>
                                            <p>In Progress</p>
                                        </div>
                                    </li>
                                    <li className="group d-flex bordr">
                                        <div className="avatar">
                                            <Image
                                                src="/assets/images/profile-img.png"
                                                alt="img"
                                                className="img-fluid user-img img-round"
                                                width={40}
                                                height={40}
                                                priority
                                            />
                                        </div>
                                        <div className='namedescription'>
                                            <p className="GroupName">John smith</p>
                                            <p className="GroupDescrp">Wordpress Developer</p>
                                        </div>
                                        <div className='progres'>
                                            <p>In Progress</p>
                                        </div>
                                    </li>
                                    <li className="group d-flex bordr">
                                        <div className="avatar">
                                            <Image
                                                src="/assets/images/profile-img.png"
                                                alt="img"
                                                className="img-fluid user-img img-round"
                                                width={40}
                                                height={40}
                                                priority
                                            />
                                        </div>
                                        <div className='namedescription'>
                                            <p className="GroupName">John smith</p>
                                            <p className="GroupDescrp">Wordpress Developer</p>
                                        </div>
                                        <div className='progres'>
                                            <p>In Progress</p>
                                        </div>
                                    </li>
                                    <li className="group d-flex bordr">
                                        <div className="avatar">
                                            <Image
                                                src="/assets/images/profile-img.png"
                                                alt="img"
                                                className="img-fluid user-img img-round"
                                                width={40}
                                                height={40}
                                                priority
                                            />
                                        </div>
                                        <div className='namedescription'>
                                            <p className="GroupName">John smith</p>
                                            <p className="GroupDescrp">Wordpress Developer</p>
                                        </div>
                                        <div className='progres'>
                                            <p>In Progress</p>
                                        </div>
                                    </li>
                                    <li className="group d-flex bordr">
                                        <div className="avatar">
                                            <Image
                                                src="/assets/images/profile-img.png"
                                                alt="img"
                                                className="img-fluid user-img img-round"
                                                width={40}
                                                height={40}
                                                priority
                                            />
                                        </div>
                                        <div className='namedescription'>
                                            <p className="GroupName">John smith</p>
                                            <p className="GroupDescrp">Wordpress Developer</p>
                                        </div>
                                        <div className='progres'>
                                            <p>In Progress</p>
                                        </div>
                                    </li>
                                    <li className="group d-flex bordr">
                                        <div className="avatar">
                                            <Image
                                                src="/assets/images/profile-img.png"
                                                alt="img"
                                                className="img-fluid user-img img-round"
                                                width={40}
                                                height={40}
                                                priority
                                            />
                                        </div>
                                        <div className='namedescription'>
                                            <p className="GroupName">John smith</p>
                                            <p className="GroupDescrp">Wordpress Developer</p>
                                        </div>
                                        <div className='progres'>
                                            <p>In Progress</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-8'>
                        <div className='card bg-gray mt-3 me-3 p-3 right-message'>
                            <div className="ChatHead">
                                <li className="group">
                                    <div className="avatar"><img src="imgs/Asset 1.svg" alt="" /></div>
                                    <p className="GroupName">David Johnson</p>
                                </li>
                                <div className="callGroupicon d-flex align-items-center">


                                    <div className="search-boxx ">
                                        <button className="btn-search"> <Icon className='text-info m-1' icon="weui:search-outlined" /></button>
                                        <input type="text" className="input-search" placeholder="Type to Search..." />
                                    </div>

                                    
                                    <Icon className='text-info m-1 fs-24' icon="material-symbols-light:call-outline-sharp" />
                                    <Icon className='text-info m-1 fs-24' icon="carbon:video" />
                                    <Icon className='text-info m-1 fs-24' icon="mage:dots" />

                                </div>
                            </div>
                            <div className='msg-body'>

                                <div className='row'>
                                    <div className='col-6'>
                                        <div className='question'>
                                            <div className='text'>
                                                <p>How are You?</p>
                                            </div>
                                            <span>Today,8:30pm</span>

                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-6 ms-auto'>
                                        <div className='answer'>
                                            <div className='text'>
                                                <p>i am fine and how are you?</p>
                                            </div>
                                            <span>Today,8:34pm</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-6'>
                                        <div className='question'>
                                            <div className='text'>
                                                <p>I am doing well, Can we meet tomorrow?</p>
                                            </div>
                                            <span>Today,8:36pm</span>

                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-6 ms-auto'>
                                        <div className='answer'>
                                            <div className='text'>
                                                <p>Yes Sure!</p>
                                            </div>
                                            <span>Today,8:58pm</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-6'>
                                        <div className='question'>
                                            <div className='text'>
                                                <p>I am doing well, Can we meet tomorrow?</p>
                                            </div>
                                            <span>Today,8:36pm</span>

                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-6 ms-auto'>
                                        <div className='answer'>
                                            <div className='text'>
                                                <p>Yes Sure!</p>
                                            </div>
                                            <span>Today,8:58pm</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-6'>
                                        <div className='question'>
                                            <div className='text'>
                                                <p>I am doing well, Can we meet tomorrow?</p>
                                            </div>
                                            <span>Today,8:36pm</span>

                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-6 ms-auto'>
                                        <div className='answer'>
                                            <div className='text'>
                                                <p>Yes Sure!</p>
                                            </div>
                                            <span>Today,8:58pm</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='d-flex mt-5'>

                                    <div className='typing-area  d-flex align-items-center w-100'>
                                        <div className="chat-area-actions d-flex align-items-center w-100">
                                            <Icon className='attach-icon' icon="fluent:attach-16-regular" />
                                            <textarea className="chat-area-input w-100 px-5 pt-2" rows={2} placeholder="Write a message"></textarea>
                                            <Icon className='send-icon' icon="bi:send" />
                                        </div>
                                    </div>
                                    <div className='voice-icon m-2'>
                                        <Icon icon="icon-park-outline:voice" />
                                    </div>
                                </div>


                            </div>

                        </div>

                    </div>
                </div>









            </div>


        </div>

    )
}

export default Message