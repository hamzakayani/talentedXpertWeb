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
        if (!userName) return;
        const initials = getFirstInitials(userName);
        const randomColor = initials && getColorFromInitial(initials?.charAt(0));

        return (
            <div
                {...rest}
                style={{ border: 'none' }}
            >
                <div className='mx-auto'
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: randomColor,
                        width: `${rest?.width}px`,  // Match image size
                        height: `${rest?.height}px`, // Match image size
                        borderRadius: '50%', // Circular shape
                        color: '#fff',
                        fontSize: '18px', // Adjust font size to match
                        fontWeight: 'bold', // Make it bold like profile images
                        margin: 0,
                    }}
                >
                    {initials}
                </div>
            </div>
        );
    };
    return (
        <>
            {(imgSrc && isImageLoaded) || (userName === null) ? (
                <Image
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
