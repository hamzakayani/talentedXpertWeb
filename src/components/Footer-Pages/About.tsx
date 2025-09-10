'use client'
import React, { useEffect, useState } from 'react'
import ImageFallback from '../common/ImageFallback/ImageFallback'
import { useFetchAboutUs } from '@/hooks/about-us/useAboutUs';
import GlobalLoader from '../common/GlobalLoader/GlobalLoader';
import HtmlData from '../common/HtmlData/HtmlData';

const About = () => {
  // Fetch about us data using the custom hook
  const fetchAboutUsQuery = useFetchAboutUs();

  if (fetchAboutUsQuery?.isLoading) {
    return <GlobalLoader />;
  }

  if (fetchAboutUsQuery?.error) {
    return (
      <section className="herosection forpadding pb-5">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="text-danger">Error loading about us information</h2>
            <p className="text-muted">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="herosection forpadding pb-5">
      <div className="container-fluid p-0">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8 col-xl-7 mx-auto">
              <div className="card shadow-sm border-0 rounded-3 mb-5">
                <div className="card-body p-4">
                <h1 className="text-center mb-4 text-black">About Us</h1>
                  <h2 className="mb-4">{fetchAboutUsQuery?.data?.data?.aboutus?.[0]?.title || ''}</h2>
                  <HtmlData 
                    data={fetchAboutUsQuery?.data?.data?.aboutus?.[0]?.content || 'No content found yet'} 
<<<<<<< HEAD
                    className="text-muted mb-4"
                    isDark
=======
                    className="blackparagraphs text-muted mb-4"
>>>>>>> 9ee3ab199e5916a7af590e17409d3be8f19df273
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
