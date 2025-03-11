'use client'
import { getColorFromInitial, getFirstInitials } from '@/services/utils/util';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const ImageFallback = ({ src, fallbackSrc, blurDataURL, alt, userName, ...rest }: any) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isImageLoaded, setIsImageLoaded] = useState(true);

    useEffect(() => {
        setImgSrc(src);
        setIsImageLoaded(true);
    }, [src]);

    const handleLoadingComplete = (result: any) => {
        if (result.naturalWidth === 0) {
            // Broken image, fallback to default
            setImgSrc(fallbackSrc);
            setIsImageLoaded(false); // Mark image as broken
        }
    };

    const handleError = () => {
        setImgSrc(fallbackSrc);
        setIsImageLoaded(false); // Mark image as broken
    };

    const renderInitials = () => {
        if(!userName) return;
        const initials = getFirstInitials(userName);
        const randomColor = initials && getColorFromInitial(initials?.charAt(0));

        return (
            <div
                {...rest}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: randomColor, // You can adjust this to any color you prefer
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    color: '#fff',
                    fontSize: '24px', // Adjust the font size as needed
                }}
            >
                {initials}
            </div>
        );
    };

    return (
        <>
            {imgSrc && isImageLoaded ? (
                <img
                    {...rest}
                    src={imgSrc}
                    alt={alt}
                    onLoadingComplete={handleLoadingComplete}
                    onError={handleError}
                    placeholder={blurDataURL ? 'blur' : 'empty'}
                    blurDataURL={blurDataURL}
                />
            ) : (
                renderInitials() // Show initials fallback
            )}
        </>
    );
};

export default ImageFallback;
