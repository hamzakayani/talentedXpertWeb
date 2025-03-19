import React, { useEffect, useState } from "react";
import headerLogo from "../../public/assets/images/header-logo.svg";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import profileImg from "../../public/assets/images/profile-img.png"
import { RootState } from "@/reducers/Reducer";
import { usePathname, useRouter } from "next/navigation";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { useAppDispatch } from "@/store/Store";
import { setUser } from "@/reducers/UserSlice";
import { clearToken, saveToken, setAuthState } from "@/reducers/AuthSlice";
import ImageFallback from "./common/ImageFallback/ImageFallback";
import { dynamicBlurDataUrl } from "@/services/utils/dynamicBlurImage";
import { setThread } from "@/reducers/ThreadSlice";
import defaultUserImg from "../../public/assets/images/default-user.jpg"
import useSocket from "@/hooks/useSocket";
import Notifications from "./common/Notifications/Notifications";

export default function Header() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user);

  const dispatch = useAppDispatch()

  const pathName = usePathname()
  const router = useRouter();

  useSocket();

  const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');

  useEffect(() => {
    if (pathName?.includes("/dashboard") && !isAuth) {
      router.push("/");
    }
  }, [isAuth, pathName, router]);

  useEffect(() => {
    if (isAuth) {
      getUserDetails()


    }
  }, [isAuth])

  useEffect(() => {
    if (user?.profilePicture || profileImg) {
      fetchBlurDataURL();
    }
  }, [user?.profilePicture, profileImg]);


  const fetchBlurDataURL = async () => {
    if (user?.profilePicture?.fileUrl || profileImg) {
      const blurUrl = await dynamicBlurDataUrl(user?.profilePicture?.fileUrl || profileImg);
      setProfileImageBlurDataURL(blurUrl);
    }
  }

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
    dispatch(setThread(null));
    dispatch(clearToken())
    dispatch(setUser(null))
    localStorage.clear()
    router.push('/')
  }

  // const redirectUrl = (link: string) => {
  //   return isAuth ? link : '/signin';
  // }

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-lg  without-login ">
          <div className="container-fluid mx-0 mx-md-4 mx-4 ">
            <div className="navbar-brand">
              {pathName?.includes("/dashboard") && isAuth && <button className="btn bg-transparent border d-lg-none offcanvas-show-btn me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasResponsive" aria-controls="offcanvasResponsive">
                <Icon icon="icon-park-outline:hamburger-button" className="fs-1" />
              </button>}
              <Link href={'/'}>
                <ImageFallback
                  className="navbar-brand-image"
                  src={headerLogo}
                  alt="Header Logo"
                  priority
                />
              </Link>
            </div>

            <div className="collapse navbar-collapse ms-lg-4 flex-wrap ">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item ">
                  <Link className="nav-link active" aria-current="page" href="/">
                    Home
                  </Link>
                </li>
                {isAuth && (<li className="nav-item ">

                  <Link className="nav-link" href="/dashboard">
                    Dashboard
                  </Link>
                </li>)}
                <li className="nav-item  ">
                  <Link className="nav-link" href={"/talented-xperts"}>
                    TalentedXperts
                  </Link>
                </li>
                <li className="nav-item ">
                  <Link className="nav-link" href={"/talent-requestors"}>
                    TalentRequestors
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href={"/tasks"}>
                    Tasks
                  </Link>
                </li>
              </ul>
              {!isAuth ? (
                <div className="d-flex gap-2 ">
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
                  <div style={{ display: 'flex', alignItems: 'center ' }}>
                    <Notifications />
                    <div className="dropdown text-start d-none d-lg-block ">
                      <button className="d-flex align-items-center border-0 bg-transparent  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <ImageFallback
                          src={user?.profilePicture?.fileUrl ? user?.profilePicture?.fileUrl : defaultUserImg}
                          fallbackSrc={profileImg}
                          className=" user-img img-round"
                          width={32}
                          height={32}
                          alt="User Image"
                          loading='lazy'
                          blurDataURL={profileImageBlurDataURL}
                        />
                        <div className="d-flex ms-2 flex-column">
                          <div className="fs-14 fw-bold text-dark text-start">{user?.firstName} {user?.lastName}</div>
                          <div className="text-muted fs-12 truncate ">{user?.email}</div>
                        </div>
                      </button>
                      <ul className="dropdown-menu profile-settings">
                        <li><Link className="dropdown-item text-dark cursor" href="/dashboard/profile-setting">Profile Settings</Link></li>
                        <li><span className="dropdown-item text-dark cursor" onClick={handleLogout}>Log out</span></li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>


            {/* without login offcanvas start */}
            <div className="offcanvas offcanvas-start text-bg-dark text-white d-lg-none off-canv-without-login" tabIndex={1} id="offcanvasDark" aria-labelledby="offcanvasDarkLabel">
              <div className="offcanvas-header">
                <Link href={'/'}>
                  <ImageFallback
                    className="navbar-brand-image"
                    src={headerLogo}
                    alt="Header Logo"
                    priority
                  />
                </Link>
                <button type="button" className="btn-close bg-light me-3" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                <ul>
                  <li>
                    <Link className="nav-link active" href="/">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-link" href={"/talented-xperts"}>
                      TalentedXperts
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-link" href={"/talent-requestors"}>
                      TalentRequestors
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-link" href={"/tasks"}>
                      Tasks
                    </Link>
                  </li>
                </ul>
                <div className="d-flex gap-2 d-block d-lg-none">
                  <Link
                    className="btn btn-outline-dark rounded-pill text-white border-light"
                    href={'/register'}
                  >
                    Register
                  </Link>
                  <Link className="btn btn-info rounded-pill" href={'/signin'} >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>

            {/* without login offcanvas end */}
            {!isAuth && <button type="button" className="btn btn-light d-lg-none bg-transparent border-0 r-50" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDark" aria-controls="offcanvasDark">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--icon-park-outline fs-1 ms-1" width="1em" height="1em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"></path></svg>
            </button>}
          </div>
        </nav>
      </header>
    </div>
  );
}
