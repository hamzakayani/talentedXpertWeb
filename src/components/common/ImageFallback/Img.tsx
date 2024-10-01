import Image from 'next/image'
import React from 'react'

const Img = ({src, height, width, alt, ...rest}: any) => {
  return (
    <div>
      <Image  
                  src= {src}
                  width={width}
                  height={height}
                  alt="img"
                  // placeholder="blur"
                  {...rest} 
                />
    </div>
  )
}

export default Img
