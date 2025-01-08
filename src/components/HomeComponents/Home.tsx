'use client'
import React from 'react'
import PromotedTasks from './PromotedTasks';
import PromotedTalentExperts from './PromotedTalentExperts';
import Categories from './Categories';
import MainDescription from './MainDescription';
import TalentedXpertWork from './TalentedXpertWork';
import BecomeXpert from './BecomeXpert';
import ClientTestimonial from './ClientTestimonial';

const Home = () => {
  return (
    <main className="main">
      <MainDescription/>
      <TalentedXpertWork/>
      <PromotedTaletExperts/>
      <PromotedTasks/>
      <Categories/>
      <ClientTestimonial/>
      <BecomeXpert />
    </main>    
  )
}

export default Home
