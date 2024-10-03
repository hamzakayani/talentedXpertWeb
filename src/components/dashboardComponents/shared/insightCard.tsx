import { insideCard } from '@/services/helpers/dashboard'
import React from 'react'

const InsightCard = () => {
  return (
    <section className="promoted_te_section pb-3">
                    <div className="row">
                    {insideCard.map((data:any)=>(<div className="col-sm-6 col-xl-3 mb-2">
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
