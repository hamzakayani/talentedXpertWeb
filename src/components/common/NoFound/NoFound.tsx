
import React from 'react'
import HtmlData from '../HtmlData/HtmlData';

const NoFound = ({ message, className, isDark, fs }: any) => {
  return (
    <div className={`${className || 'card-bodyy'}`}>
      <HtmlData data={message} className={`text-center p-3 ${isDark ? 'text-dark' : 'text-white'} ${fs ? fs : ''}`}/>
    </div>
  );
}

export default NoFound
