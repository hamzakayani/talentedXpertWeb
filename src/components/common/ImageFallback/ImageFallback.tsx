'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const ImageFallback = ({ src, fallbackSrc, blurDataURL, alt, ...rest }: any) => {
    const [imgSrc, set_imgSrc] = useState(src);
<<<<<<< HEAD
=======

>>>>>>> 4900c6ed09e2eddac80075d47284cdfd1e4b06d2
    useEffect(() => {
        let img = src 
        set_imgSrc(img);
    }, [src]);

    const handleLoadingComplete = (result:any) => {
        if (result.naturalWidth === 0) {
            // Broken image
            set_imgSrc(fallbackSrc);
        }
    }

    const handleError = () => {
        set_imgSrc(fallbackSrc);
    }

    return (
        <Image
            {...rest}
            src={imgSrc}
            alt={alt}
            onLoad={(result) => handleLoadingComplete(result)}
            onError={handleError}
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
        />
    )
}

export default ImageFallback