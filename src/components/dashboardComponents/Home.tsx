'use client'
import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Sidebar from './sidebar/sidebar';
import InsightCard from './shared/insightCard';
import { mytasks } from '@/services/helpers/mytasks';
import MyActiveTask from './MyActiveTask';
// import Img from '../common/ImageFallback/img';

const Home = () => {
    console.log("<<<")
    const handleAddTask=() =>{
        
    }
    return (
        <>
            <div className='top-card '>
                <InsightCard/> 
            </div>

            <MyActiveTask />
            



        </>
    )
}

export default Home