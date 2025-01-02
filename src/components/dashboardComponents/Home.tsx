'use client'
import React, { useEffect, useState } from 'react'
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
import { usePathname, useRouter } from 'next/navigation';

const Home = () => {
    const router = useRouter();
    const pathName = usePathname()
    const user = useSelector((state: RootState) => state.user)

    return (
        
            <>
            <div className='top-card '>
                <InsightCard insideCard={user?.profile?.length> 0 && user?.profile[0]?.type === 'TR' ? insideTRCard : insideTECard} />
            </div>

            {user?.profile?.length> 0 && user?.profile[0]?.type === 'TR' ?  <MyActiveTask /> : <Activeandarticle /> } 
            {/* <Proposalform /> */}
            {/* <Proposalviewdetail /> */}
            {/* <Alltasks1/> */}
            {/* <Activeandarticle /> */}
            {/* {/* {user?.profile?.length> 0 && user?.profile[0]?.type === 'TR' && <Articles />} */}

            </>
       

       

    )
}

export default Home