import React, { FC } from 'react'
import { Icon } from '@iconify/react';
import Link from 'next/link';

const InsightCard: FC<any> = ({ insideCard }) => {
    return (
        <section className="promoted_te_section pb-3">
            <div className="row">
                {insideCard.map((data: any, index: number) => (
                    <div className="col-sm-6 col-xl-3 mb-2" key={index}>
                        <div className="promoted_card">
                            <Link href={data?.url} className="card_heading top-cards">
                                <div className="dib">
                                    {data?.icon?.includes(':') ?
                                        <span className={`bg-white text-dark rounded-pill fs-2 p-lg-3 p-md-1`}>
                                            <Icon className='me-4' icon={data?.icon} />
                                        </span>
                                        :
                                        <span className={`material-symbols-outlined bg-white text-dark rounded-pill fs-2 p-lg-3 p-md-1`}>
                                           {data?.icon}
                                        </span>
                                    }
                                    <div className="victorimgup"></div>
                                </div>
                                <h5 className='text-white'>{data.text}</h5>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default InsightCard
