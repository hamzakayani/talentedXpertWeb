import React, {useEffect} from "react";
import Image from "next/image";
import { Icon } from '@iconify/react';
import { usePathname } from "next/navigation";
import Link from "next/link";

function Footer() {
  const pathName = usePathname()
  const isView = pathName?.includes('/dashboard') ? false : true
  
  

  return (
    <footer className="footer-section">
      <div className="container-fluid">
        <div className={`row bg-dark ${isView? 'pt-5' :"pt-2"} px-5`}>
          <div className="col-12 text-white">
            <div className="row">
              
              { isView? (
                <>
                  <div className="col-md-4 col-lg-4">
                    <Image
                      src="/assets/images/footer-logo.svg"
                      alt="img"
                      className="img-fluid mb-3"
                      width={255}
                      height={255}
                      priority
                    />
                    <h6>Call now:(319) 555-0115</h6>
                    <p className="text-white fs-12">
                      6391 Elgin St. Celina, Delaware 10299, New <br />
                      York, United States of America
                    </p>
                  </div>
                  <div className="col-md-3 col-lg-2">
                    <h6 className="mb-4">Quick Links</h6>
                    <p><Link className="text-white fs-14 footer-text" href={'/about'}>About</Link></p>
                    <p className="text-white fs-14 footer-text">Projects</p>
                    <p><Link className="text-white fs-14 footer-text" href={'/blog'}>Blog</Link></p>
                    <p><Link className="text-white fs-14 footer-text" href={'/dashboard/dispute'}>Dispute</Link></p>
                  </div>
                  <div className="col-md-3 col-lg-2">
                    <h6 className="mb-4">TalentedXpert</h6>
                    <p><Link className="text-white fs-14 footer-text" href={'/task'}>Tasks</Link></p>
                    <p><Link className="text-white fs-14 footer-text" href={'/articles'}>Articles</Link></p>
                    <p><Link className="text-white fs-14 footer-text" href={'/talented-xperts'}>SmartDash</Link></p>
                    {/* <p><Link className="text-white fs-14 footer-text" href={'/talented-xperts'}>TalentedXpert</Link></p>
                    <p><Link className="text-white fs-14 footer-text" href={'/talented-requesters'}>TalentRequester</Link></p> */}
                  </div>
                  <div className="col-md-3 col-lg-2">
                    <h6 className="mb-4">TalentRequester</h6>
                    <p><Link className="text-white fs-14 footer-text" href={'/dashboard/add-task'}>Post a Task</Link></p>
                    <p className="text-white fs-14 footer-text">Browse TalentedXperts</p>       
                    <p><Link className="text-white fs-14 footer-text" href={'/talented-xperts'}>My Tasks</Link></p>            
                    <p><Link className="text-white fs-14 footer-text" href={'/talented-requesters'}>SmartDash</Link></p>
                    {/* <p className="text-white fs-14 footer-text">TalentRequester Profile</p>
                    <p className="text-white fs-14 footer-text">Applications</p> */}
                  </div>
                  <div className="col-md-3 col-lg-2">
                    <h6 className="mb-4">Contact</h6>
                    <p><Link className="text-white fs-14 footer-text" href={'/FAQs'}>FAQs</Link></p>
                    <p><Link className="text-white fs-14 footer-text" href={'/privacyPolicy'}>Privacy Policy</Link></p>
                    <p><Link className="text-white fs-14 footer-text" href={'/termsConditions'}>Terms & Conditions</Link></p>
                    
                  </div>
                  <div className="border-bottom border-grey"></div>
                </>
              ) : null}

              
                <div className="col-12">
                  <div className="d-flex justify-content-between pt-2 pe-3 mb-2">
                    <p className="text-white fs-10 mb-0">@ 2024 TalentedXpert. All rights Reserved</p>
                    <div className="d-flex">
                      <Icon icon="ri:facebook-fill" className="me-2" />
                      <Icon icon="iconoir:youtube" className="me-2" />
                      <Icon icon="lets-icons:insta" className="me-2" />
                      <Icon icon="mdi:twitter" className="me-2" />
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
