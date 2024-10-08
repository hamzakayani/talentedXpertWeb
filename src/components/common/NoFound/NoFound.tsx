import Image from 'next/image';
import Link from 'next/link'
import React from 'react'

const NoFound = ({message}:any) => {
  return (
   
          <div className="card border-0">
            
            <div className="card-body">
              <p className="card-text">
                {message}
              </p>
            </div>
          </div>
        
  );
  
}

export default NoFound
