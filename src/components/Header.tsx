import React, { useEffect, useState } from "react";
import headerLogo from "../../public/assets/images/header-logo.svg";
import Link from "next/link";

import { useSelector } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import profileimg from "../../public/assets/images/profile-img.png"
import { RootState } from "@/reducers/Reducer";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { useAppDispatch } from "@/store/Store";
import { setUser } from "@/reducers/UserSlice";
import { clearToken, saveToken, setAuthState } from "@/reducers/AuthSlice";

export default function Header() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user);

  const dispatch = useAppDispatch()

  const pathName = usePathname()
  const router = useRouter();

  useEffect(() => {
    if (pathName?.includes("/dashboard") && !isAuth) {
      router.push("/signin");
    }
  }, [isAuth, pathName, router]);

  useEffect(() => {
    if (isAuth) {
      getUserDetails()
    }
  }, [isAuth])

  const getUserDetails = async () => {
    await apiCall(requests.getUserInfo, {}, 'get', false, dispatch, user, router).then((res: any) => {
      if (res?.error) {
        return;
      } else {
        dispatch(setUser(res?.data))
      }
    }).catch(err => console.warn(err))
  }
  const handleLogout = () => {
    dispatch(saveToken(null))
    dispatch(setAuthState(false))
    dispatch(clearToken())
    dispatch(setUser(null))
    localStorage.clear()
    router.push('/signin')
}

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
                {isAuth ? (<li className="nav-item">

                  <Link className="nav-link" href="/dashboard">
                    Dashboard
                  </Link>
                </li>) : ("")}
                <li className="nav-item">
                  <Link className="nav-link" href="/dashboard/talented-xperts">
                    TalentedXperts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/dashboard/talented-requestors">
                    TalentRequesters
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/dashboard/tasks">
                    Tasks
                  </Link>
                </li>

              </ul>
              {!isAuth ? (
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
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginLeft: 'auto' }}>
                      <Icon icon="ep:message" className="text-dark" width="24" height="24" />
                      


                      <div className="dropdown">
                      <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <Icon icon="iconamoon:notification-fill" className="text-dark ms-2 me-2" width="24" height="24" />
                      </button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">Notifications</a></li>
                        <li><a className="dropdown-item" href="#">Notifications</a></li>

                      </ul>
                    </div>


                    </div>
                    <Image
                      src={user?.profilePicture ? user?.profilePicture : profileimg}
                      className="img-fluid user-img img-round"
                      width={32}
                      height={32}
                      alt="User Image"
                    />

                    <div className="d-flex ms-2 flex-column">
                      <div className="fs-14 fw-bold text-dark">{user?.firstName} {user?.lastName}</div>
                      <div className="text-muted fs-12 truncate ">{user?.email}</div>
                    </div>

                    <div className="dropdown">
                      <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      </button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="/dashboard/profile-setting">Profile Settings</a></li>
                        <li><a className="dropdown-item" href="#" onClick={handleLogout}>Log out</a></li>

                      </ul>
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
