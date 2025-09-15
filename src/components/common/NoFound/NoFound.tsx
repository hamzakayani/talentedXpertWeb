
import React from 'react'
import HtmlData from '../HtmlData/HtmlData';

const NoFound = ({ message, className }: any) => {
  return (
    <div className={`${className || 'card-bodyy'}`}>
      <HtmlData data={message} className='text-center p-3 text-white'/>
    </div>
  );
}

export default NoFound
