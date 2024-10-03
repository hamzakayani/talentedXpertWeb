import React, { FC } from 'react'

const InsightCard:FC<any> = ({ insideCard }) => {
    return (
        <section className="promoted_te_section pb-3">
            <div className="row">
                {insideCard.map((data: any, index:number) => (
                    <div className="col-sm-6 col-xl-3 mb-2" key={index}>
                        <div className="promoted_card">
                            <div className="card_heading top-cards">
                                <div className="dib">
                                    <span className="material-symbols-outlined bg-white text-dark rounded-pill fs-2 p-lg-3 p-md-1">
                                        group_add
                                    </span>
                                    <div className="victorimgup"></div>
                                </div>
                                <h5>{data.text}</h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default InsightCard
