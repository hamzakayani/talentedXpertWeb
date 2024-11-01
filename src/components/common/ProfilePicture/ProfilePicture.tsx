import React, { useEffect, useState } from 'react'
import ImageFallback from '../ImageFallback/ImageFallback';
import { dynamicBlurDataUrl } from '@/services/utils/dynamicBlurImage';
import { useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { RootState } from '@/reducers/Reducer';
import { useRouter } from 'next/navigation';

const ProfilePicture = ({source}:any) => {

    const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');

    useEffect(() => {
        fetchBlurDataURL();
    }, [source]);


    const fetchBlurDataURL = async () => {
        if (source) {
            const blurUrl = await dynamicBlurDataUrl(source);
            setProfileImageBlurDataURL(blurUrl);
        }
    }

    return (
        <div>
            <ImageFallback
                src={source || "/assets/images/profile-img.png"}
                alt="img"
                className="img-fluid user-img img-round"
                width={60}
                height={60}
                loading='lazy'
                blurDataURL={profileImageBlurDataURL}
            />
        </div>
    )
}

export default ProfilePicture
