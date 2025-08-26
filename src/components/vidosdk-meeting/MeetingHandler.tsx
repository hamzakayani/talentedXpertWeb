'use client'
import { useParams } from 'next/navigation';
import React from 'react'

const MeetingHandler = () => {    
    const { id } = useParams();
    console.log("Meeting ID:", id);
    return (
        <div>MeetingHandler</div>
    )
}

export default MeetingHandler