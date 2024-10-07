'use client'
import React from 'react'
import InsightCard from './shared/insightCard';
import MyActiveTask from './MyActiveTask';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { insideTECard, insideTRCard } from '@/services/helpers/dashboard';
import Articles from './Articles';

const Home = () => {
    const user = useSelector((state:RootState) => state.user)
    
    return (
        <>
            <div className='top-card '>
                <InsightCard insideCard={user?.profile[0]?.type === 'TR' ? insideTRCard : insideTECard} /> 
            </div>
            <MyActiveTask />
            {user?.profile[0]?.type === 'TR' && <Articles />}
        </>
    )
}

export default Home