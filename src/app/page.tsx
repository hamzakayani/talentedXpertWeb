import Home from '@/components/HomeComponents/Home'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default function page() {
  return (     
    <Home/>    
  );
}
