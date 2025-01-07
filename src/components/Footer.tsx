import React, {useEffect} from "react";
import Image from "next/image";
import { Icon } from '@iconify/react';
import { usePathname } from "next/navigation";
import Link from "next/link";
import ImageFallback from "./common/ImageFallback/ImageFallback";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

function Footer() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const pathName = usePathname()
  const isView = pathName?.includes('/dashboard') ? false : true
  
  const redirectUrl = (link: string) => {
    return isAuth ? link : '/signin';
  }

  return (
    <footer className="footer-section">
      <div className="container-fluid">
        <div className={`row bg-dark ${isView? 'pt-5' :"pt-2"} px-3`}>
          <div className="col-12 text-white">
            <div className="row">
              
              { isView? (
                <>
                  <div className="col-md-4 mb-3 ">
                    <div className="d-flex flex-column d-sm-block justify-content-center ">
                    <ImageFallback
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
                  </div>
                  <div className="col-md-3 col-6 col-lg-2">
                    <h6 className="mb-4">Quick Links</h6>
                    <p><Link className="text-white fs-14 footer-text" href={'/about'}>About</Link></p>
                    <p className="text-white fs-14 footer-text">Projects</p>
                    <p><Link className="text-white fs-14 footer-text" href={'/blog'}>Blog</Link></p>
                    <p><Link className="text-white fs-14 footer-text" href={redirectUrl('/dashboard/dispute')}>Dispute</Link></p>
                  </div>
                  <div className="col-md-3 col-6 col-lg-2">
                    <h6 className="mb-4">TalentedXpert</h6>
                    <p><Link className="text-white fs-14 footer-text" href={'/task'}>Tasks</Link></p>
                    <p><Link className="text-white fs-14 footer-text" href={'/talented-xperts'}>TalentedXpert</Link></p>
                    <p><Link className="text-white fs-14 footer-text" href={'/talented-requester'}>TalentedRequester</Link></p>
                    <p><Link className="text-white fs-14 footer-text" href={'/articles'}>Articles</Link></p>
                    {/* <p><Link className="text-white fs-14 footer-text" href={'/talented-xperts'}>TalentedXpert</Link></p>
                    <p><Link className="text-white fs-14 footer-text" href={'/talented-requesters'}>TalentRequester</Link></p> */}
                  </div>
                  <div className="col-md-3 col-6 col-lg-2 offset-0 offset-md-4 offset-lg-0">
                    <h6 className="mb-4">TalentRequester</h6>
                    <p><Link className="text-white fs-14 footer-text" href={redirectUrl('/dashboard/add')}>Post a Task</Link></p>
                    <p> <Link className="text-white fs-14 footer-text" href={'/talented-xperts'}>Browse TalentedXpert</Link></p>      
                    <p><Link className="text-white fs-14 footer-text" href={redirectUrl('/dashboard/tasks')}>TalentedRequester Profile</Link></p>            
                    <p><Link className="text-white fs-14 footer-text" href={'/talented-requesters'}>Applications</Link></p>
                    {/* <p className="text-white fs-14 footer-text">TalentRequester Profile</p>
                    <p className="text-white fs-14 footer-text">Applications</p> */}
                  </div>
                  <div className="col-md-3 col-6 col-lg-2">
                    <h6 className="mb-4">Contact</h6>
                    <p><Link className="text-white fs-14 footer-text" href={'/FAQs'}>FAQs</Link></p>
                    <p><Link className="text-white fs-14 footer-text" href={'/privacyPolicy'}>Privacy Policy</Link></p>
                    <p><Link className="text-white fs-14 footer-text" href={'/termsConditions'}>Terms & Conditions</Link></p>
                    
                  </div>
                  <div className="border-bottom border-grey"></div>
                </>
              ) : null}

              
                <div className="col-12 ">
                  <div className="d-lg-flex d-md-flex d-block justify-content-between pt-2 pe-3 mb-2 text-center ">
                    <p className="text-white fs-14 mb-0">@ 2024 TalentedXpert. All rights Reserved</p>
                    <div className="d-flex d-sm-block justify-content-center mt-1 mt-lg-0 mt-md-0">
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
