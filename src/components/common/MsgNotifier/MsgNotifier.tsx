'use client'
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { RootState, useAppDispatch } from '@/store/Store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const MsgNotifier = ({senderProfileId, receiverProfileId, text, taskId}:any) => {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const user = useSelector((state: RootState) => state.user)
  const [threadId, setThreadId] = useState<any>({})
  console.log('tata')

  useEffect(()=>{

    console.log('rr',receiverProfileId)

  },[])

  useEffect(()=>{
      console.log('useEffect about to call getMessageThread');
      getMessageThread();

  },[])
  useEffect(()=>{
    handleSend();
},[threadId])
  
  const getMessageThread = async () => {
    console.log('tata2')
    try {
      const response = await apiCall(requests.getThread, {}, 'get', false, dispatch, user, router);
      console.log('MSGresponse', response);
      if (!response?.data?.threads?.some((thread: { expertProfileId: number }) => thread.expertProfileId === Number(receiverProfileId)))
        {
        let data = {
          'taskId': Number(taskId),
          'expertProfileId': Number(receiverProfileId)
        }
        const res = await apiCall(requests.createThread, data, 'post', false, dispatch, user, router);
        console.log('MSG2response (new thread)', res);
        setThreadId(response?.data?.threads[0]?.id || {});
      }
      else {
        console.log('id', response, response?.data?.threads[0]?.id)
      }
      setThreadId(response?.data?.threads[0]?.id || {});
    } catch (error) {
      console.warn('Error fetching tasks:', error);
    }
  }

  const handleSend = async () => {
    const data = {
        "senderProfileId": Number(senderProfileId),
        "receiverProfileId": Number(receiverProfileId),
        "text": String(text),
        "threadId": Number(threadId)
    };
    try {
        await apiCall(requests.sendMsg, data, 'post', true, dispatch, user, router);
    } catch (error) {
        console.warn("Error sending message", error);
    }
};
  return null;
}

export default MsgNotifier
