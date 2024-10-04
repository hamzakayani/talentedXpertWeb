'use client'
import React from 'react'
import InsightCard from './shared/insightCard';
import MyActiveTask from './MyActiveTask';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { insideTECard, insideTRCard } from '@/services/helpers/dashboard';
import Articles from './Articles';
import Newarticle from './talentxpertEX/Newarticle';
import { Viewarticle } from './talentxpertEX/Viewarticle';
import { Articlelist } from './talentxpertEX/Articlelist';

const Home = () => {
    const user = useSelector((state: RootState) => state.user)

    return (
        <>
            <div className='top-card '>
                <InsightCard insideCard={user?.profile[0]?.type === 'TR' ? insideTRCard : insideTECard} />
            </div>

            {/* <MyActiveTask /> */}
            {/* <Newarticle /> */}
            {/* <Viewarticle /> */}
            <Articlelist />
            {/* {user?.profile[0]?.type === 'TR' && <Articles />} */}
        </>

    )
}

export default Home