import React from "react";
import headerLogo from "../../public/assets/images/header-logo.svg";
import Link from "next/link";

import { useSelector } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import profileimg from "../../public/assets/images/profile-img.png"
import { RootState } from "@/reducers/Reducer";
import Img from "./common/ImageFallback/Img";
import Image from "next/image";



export default function Header() {


const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

console.log("is auth>>", isAuth)


  const isAcess = useSelector((state: any) => state.access.access);

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="container">
            <Link className="navbar-brand" href="/">
              <Image
                      src={headerLogo}
                      alt="Header Logo"
                      priority

                    />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" href="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" href="/talented-xperts">
                    TalentedXperts
                    </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/talented-requesters">
                    TalentedRequestors
                    </Link>
                </li>
                <li className="nav-item">
                 
                <Link className="nav-link" href="/task">
                    Task
                    </Link>
                </li>
              </ul>
              { !isAuth ? (
              <div className="d-flex gap-2">
                
                <Link
                  className="btn btn-outline-dark rounded-pill"
                  href={'/register'}
                >
                  Register
                </Link>
                <Link className="btn btn-info rounded-pill" href={'/signin'} >
                  Sign In
                </Link>
                
              </div>
            ):(
              <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginLeft: 'auto' }}>
                <Icon icon="ep:message" className="text-dark" width="24" height="24" />
                <Icon icon="iconamoon:notification-fill" className="text-dark ms-2 me-2" width="24" height="24" />
              </div>
                {/* <Image
                  src={profileimg}
                  className="img-fluid user-img img-round"
                  width={32}
                  height={32}
                  alt="User Image"
                /> */}
                <Img src={profileimg}
                  className="img-fluid user-img img-round"
                  width={32}
                  height={32}/>
                <div className="d-flex ms-2 flex-column">
                  <div className="fs-14 fw-bold text-dark">John Doe</div>
                  <div className="text-muted fs-12 ">mailto:john.doe@example.com</div>
                </div>
                
              </div>
              </>
            )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
