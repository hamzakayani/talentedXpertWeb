import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import userimg from "../../public/assets/images/defaultuser.jpg";



const Message = () => {
  return (
    <div>






<div className='card'>
                <div className='first-card card-header d-flex justify-content-between px-4 bg-gray'>
                    <div className='card-left-heading'>
                        <h3>Message</h3>
                    </div>

                    <div className='card-right-heading d-flex justify-content-between'>
                       
                    </div>

                </div>

                <div className='msg-bodyy '>




                <main>
        <div className="sideNav1">

           
        </div>
        <div className="sideNav2">
           
            <div className="SearchInputHolder d-flex align-items-center ">
            <Icon className='ms-4' icon="fluent:search-48-filled" />
                <input className="searchInput" placeholder="Search For Chat.."/>
                <hr/>
            </div>

            <li className="group">
                <div className="avatar "><img src="imgs/Asset 1.svg" alt=""/></div>
                <p className="GroupName">David Johnson</p>
                <p className="GroupDescrp">Lorem ipsum dolor sit amet consectetur adipisicing elit. Earujdsajf djf df dfjdkj
                    dlkjfl.kjl dlkjf lkjlkdjfm, sequi.</p>
            </li>
            <li className="group">
                <div className="avatar"><img src="imgs/Asset 1.svg" alt=""/></div>
                <p className="GroupName">David Johnson</p>
                <p className="GroupDescrp ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Earujdsajf djf df dfjdkj
                    dlkjfl.kjl dlkjf lkjlkdjfm, sequi.</p>
            </li>
            <li className="group">
                <div className="avatar"><img src="imgs/Asset 1.svg" alt=""/></div>
                <p className="GroupName">David Johnson</p>
                <p className="GroupDescrp">Lorem ipsum dolor sit amet consectetur adipisicing elit. Earujdsajf djf df dfjdkj
                    dlkjfl.kjl dlkjf lkjlkdjfm, sequi.</p>
            </li>
            <li className="group">
                <div className="avatar"><img src="imgs/Asset 1.svg" alt=""/></div>
                <p className="GroupName">David Johnson</p>
                <p className="GroupDescrp">Lorem ipsum dolor sit amet consectetur adipisicing elit. Earujdsajf djf df dfjdkj
                    dlkjfl.kjl dlkjf lkjlkdjfm, sequi.</p>
            </li>
            <li className="group">
                <div className="avatar"><img src="imgs/Asset 1.svg" alt=""/></div>
                <p className="GroupName">David Johnson</p>
                <p className="GroupDescrp">Lorem ipsum dolor sit amet consectetur adipisicing elit. Earujdsajf djf df dfjdkj
                    dlkjfl.kjl dlkjf lkjlkdjfm, sequi.</p>
            </li>
          

        </div>
        <section className="Chat">
            <div className="ChatHead">
                <li className="group">
                    <div className="avatar"><img src="imgs/Asset 1.svg" alt=""/></div>
                    <p className="GroupName">Wordpress Developer</p>

                </li>
                <div className="callGroup d-flex align-items-center">

                <div className="search-box">
        <button className="btn-search"><Icon className='mx-2' icon="fluent:search-48-filled" /></button>
        <input type="text" className="input-search" placeholder="Type to Search..."/>
      </div>


                
                <Icon className='mx-2' icon="fluent:call-20-regular" />
                <Icon className='mx-2' icon="system-uicons:video" />
                <Icon className='ms-2' icon="pepicons-pencil:dots-y" />

                </div>
            </div>
            <div className="MessageContainer">
              
             
              
              <div>
                <div className='left-msg'>
                <div className="message you">
                    <p className="messageContent">How are you ?</p>
                </div>
                <div className="messageDetails1">
                        <div className="messageTime">8:30 PM</div>
                        <i className="fa-solid fa-check"></i>
                    </div>
                </div>

                </div>

                <div className="message me">
                    <p className="messageContent">I am fine and how are you ?</p>
                    
                </div>
                <div className="messageDetails">
                        <div className="messageTime">8:34 PM</div>
                        <i className="fa-solid fa-check"></i>
                    </div>
             
                <div className='left-msg'>
                <div className="message you">
                    <p className="messageContent">I am doing well, Can we meet tomorrow ?</p>
                </div>
                <div className="messageDetails1">
                        <div className="messageTime">8:36 AM</div>
                    </div>
                </div>
           
           <div className='right-msg'>
           <div className="message me">
                    <p className="messageContent">Yes Sure!</p>
                </div>
                <div className="messageDetails">
                        <div className="messageTime">8:58 PM</div>
                    </div>
                    </div>
                    <div className='left-msg'>
                <div className="message you">
                    <p className="messageContent">Thanks</p>
                </div>
                <div className="messageDetails1">
                        <div className="messageTime">9:00 PM</div>
                    </div>
                </div>
                
            </div>
            <form id="MessageForm">
                <input type="text" id="MessageInput"/>
               
                <button className="Send"><Icon icon="mynaui:send" /></button>
            </form>
        </section>
    </main>
                    

                </div>












            </div>



















    </div>
  )
}

export default Message
