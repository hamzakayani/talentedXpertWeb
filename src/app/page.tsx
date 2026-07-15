import Home from '@/components/HomeComponents/Home'
import { pageMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = pageMetadata('/')

export default function page() {
  return (     
    <Home/>    
  );
}
