
import React from 'react'
import HtmlData from '../HtmlData/HtmlData';

const NoFound = ({ message, className, fromOutside }: any) => {
  return (
    <div className={`${className || 'card-bodyy'}`}>
      <HtmlData data={message} className={`text-center p-3 ${fromOutside ? 'text-black' : 'text-white'}`}/>
    </div>
  );
}

export default NoFound
