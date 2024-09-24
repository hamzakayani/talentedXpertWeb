import React from "react";
import Image from "next/image";
import headerLogo from "../../public/assets/images/header-logo.svg";
import Link from "next/link";
// import { useRouter } from "next/navigation";

export default function Header() {
  // const router = useRouter()

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="container">
            <a className="navbar-brand" href="#">
              <Image src={headerLogo} alt="Header Logo" />
            </a>
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
              <div className="d-flex gap-2">
                <Link
                  className="btn btn-outline-info rounded-pill"
                  href={'/register'}
                  // type="submit"
                  // onClick={ () => router.push('/register')}
                >
                  Register
                </Link>
                <Link className="btn btn-info rounded-pill" href={'/signin'} >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
