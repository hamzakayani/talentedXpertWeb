import { clientTest } from '@/services/helpers/staticdata'
import { Icon } from '@iconify/react/dist/iconify.js'
import Image from 'next/image'
import React from 'react'
import Img from '../common/ImageFallback/Img'
import ClientTestimonialSlider from '../common/sliders/ClientTestimonialSlider'

const ClientTestimonial = () => {
  return (
    <section className="promoted_te_section bg_black py-5">
          <div className="container">
            <h2 className="text-white text-center mb-4">Clients Testimonial</h2>
            <ClientTestimonialSlider/>

<<<<<<< HEAD
            <div className="row">
              {clientTest.map((data: any) => (
                <div className="col" key={data.id} >

                  <div className="promoted_card mb-2">
                    <div className="card_heading">
                      <div className="userimg">
                        <Image
                          src={data.src}
                          width={48}
                          height={48}
                          alt="User Image"
                          className='user-img'
                        />
                      </div>
                      <div className="usertext">
                        <p className="mb-1 fs-12">{data.name}</p>
                        <p className="fs-12">{data.designation}</p>

                      </div>
                      {/* <Icon icon="material-symbols:format-quote" className="text-white ms-auto comma-icn" /> */}
                      <Image
                          src="assets/images/quote.svg"
                          width={48}
                          height={48}
                          alt="User Image"
                          className='ms-auto'
                        />
                    </div>
                    <div className="rating">
                      {[...Array(5)].map((_, index) => (
                        // <span
                        //   key={index}
                        //   className={`material-symbols-outlined ${index < data.rating ? "rated" : ""}`}
                        // >
                        //   kid_star
                        // </span>
                        <Icon icon="material-symbols-light:kid-star" key={index}  className={`text-light ${index < data.rating ? "rated" : ""}`}/>

                      ))}
                    </div>
                    <p className="line-clamp-3">
                      {data.description} <a href="">more</a>
                    </p>
                  </div>

                </div>
              ))}
            </div>

=======
            
>>>>>>> 23dccd93555d51c05bb52b3022920aed0119966e
          </div>
        </section>
  )
}

export default ClientTestimonial
