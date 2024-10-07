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
import { Proposalform } from './talentxpertEX/Proposalform';
import { Proposalviewdetail } from './talentxpertEX/Proposalviewdetail';
import { Alltasks1 } from './talentxpertEX/Alltasks1';
import { Activeandarticle } from './talentxpertEX/Activeandarticle';

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
            {/* <Articlelist /> */}
            {/* <Proposalform /> */}
            {/* <Proposalviewdetail /> */}
            {/* <Alltasks1/> */}
            <Activeandarticle />
            {/* {user?.profile[0]?.type === 'TR' && <Articles />} */}
        </>

    )
}

export default Home