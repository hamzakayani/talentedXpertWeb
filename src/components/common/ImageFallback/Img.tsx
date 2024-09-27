import Image from 'next/image'
import React from 'react'

const Img = (props:any) => {
  return (
    <div>
      <Image  
                  src= {props.src}
                  className={props.class}
                  width={props.width}
                  height={props.height}
                  alt="img"

                />
    </div>
  )
}

export default Img
