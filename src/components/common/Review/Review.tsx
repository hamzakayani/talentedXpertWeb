import React, { FC } from 'react'
import ImageFallback from '../ImageFallback/ImageFallback'
import RatingStar from '../RatingStar/RatingStar'

const Review: FC<any> = ({ reviewReceive }) => {

    return (
        <div className='review mx-2  p-3 mt-3'>
            <div className="d-flex">
                <div>
                    {/* <ImageFallback
                        // src={rdetails[1]?.revieweeProfile?.user?.profilePicture?.fileUrl}
                        alt="img"
                        className="user-img img-round me-3"
                        width={40}
                        height={40}
                        priority
                    /> */}
                </div>
                <div className="text-light d-flex justify-content-between">
                    <div>
                        <h6>
                            {reviewReceive?.revieweeProfile?.user?.firstName}{" "}
                            {reviewReceive?.revieweeProfile?.user?.lastName}
                        </h6>
                        <div className="ms-3">
                            <div className="rating">
                                <RatingStar rating={3} />
                            </div>
                        </div>
                        <span>{reviewReceive?.comments}</span>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Review
