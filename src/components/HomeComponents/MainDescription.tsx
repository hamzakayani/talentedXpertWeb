import { Icon } from '@iconify/react/dist/iconify.js'
import heroimg from "../../../public/assets/images/heroimg.png";
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ImageFallback from '../common/ImageFallback/ImageFallback';

const MainDescription = () => {
  return (
    <section className="herosection py-5">
          <div className="container">
            <div className="heroimg">
              <ImageFallback src={heroimg} alt="Heroimg" className="hero-img"/>
            </div>
            <div className="hero-content">
              <div className="d-flex justify-content-center flex-wrap">
                <div className="herocard">
                  <h1>Why TalentedXpert?</h1>
                  <p className='line-clamp-3'>
                  Because we deliver exceptional talent quickly and efficiently..
                  </p>
                  <a href="#">
                    Read more
                    {/* <span className="material-symbols-outlined">
                      arrow_forward
                    </span> */}
                    <Icon icon="line-md:arrow-right" />
                  </a>
                </div>
                <div className="v-divider d-block"></div>
                <div className="herocard">
                  <h1>What is TalentedXpert?</h1>
                  <p className='line-clamp-3'>
                  TalentedXpert connects businesses with top-tier talent, providing..
                  </p>
                  <a href="#">
                    Read more
                    {/* <span className="material-symbols-outlined">
                      arrow_forward
                    </span> */}
                    <Icon icon="line-md:arrow-right" />
                  </a>
                </div>
              </div>
              <div className="buttons">
              <Link
                  className="btn btn-dark rounded-pill hero-btn"
                  href={'/talented-xperts'}>Find your TalentedXperts</Link>
                {/* <button className="btn btn-dark rounded-pill hero-btn" >
                  Find your TalentedXperts
                </button> */}
                <Link
                  className="btn btn-light rounded-pill hero-btn"
                  href={'/task'}>Find your next Task</Link>
                {/* <button className="btn btn-light rounded-pill hero-btn">
                  Find your next Task
                </button> */}
                <button className="btn btn-info rounded-pill hero-btn">Join Us Now</button>
              </div>
            </div>
          </div>
        </section>
  )
}

export default MainDescription
