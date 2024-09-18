import React from "react";
import Image from "next/image";
import headerLogo from "../../../public/assets/images/header-logo.svg";
export default function Header() {
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
                  <a className="nav-link active" aria-current="page" href="#">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    TalentedXperts
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    TalentedRequestors
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Tasks
                  </a>
                </li>
              </ul>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-info rounded-pill"
                  type="submit"
                >
                  Register
                </button>
                <button className="btn btn-info rounded-pill" type="submit">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
