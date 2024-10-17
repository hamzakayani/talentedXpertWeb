import Image from 'next/image';
import Link from 'next/link'
import React from 'react'

const NoFound = ({ message }: any) => {
  return (
    <div className='card-bodyy'>
      <p className='text-center p-3'>
        {message}
      </p>
    </div>
  );

}

export default NoFound
