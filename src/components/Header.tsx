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

export default function Header() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user);

  const dispatch = useAppDispatch()

  const pathName = usePathname()
  const router = useRouter();

  const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');

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
    router.push('/signin')
  }

  const redirectUrl = (link: string) => {
    return isAuth ? link : '/signin';
  }

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="container-fluid mx-0 mx-md-4">

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
            <button
              className="navbar-toggler border-0 d-none "
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <Icon icon="pepicons-pencil:dots-y" className="fs-1" />
            </button>
            <div
              className="collapse navbar-collapse ms-lg-4 flex-wrap"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item ">
                  <Link className="nav-link active" aria-current="page" href="/">
                    Home
                  </Link>
                </li>
                {isAuth ? (<li className="nav-item ">

                  <Link className="nav-link" href="/dashboard">
                    Dashboard
                  </Link>
                </li>) : ("")}
                <li className="nav-item  ">
                  <Link className="nav-link" href={"/talented-xperts"}>
                    TalentedXperts
                  </Link>
                </li>
                <li className="nav-item ">
                  <Link className="nav-link" href={redirectUrl("/talented-requestors")}>
                    TalentRequesters
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href={"/tasks"}>
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
                  <div style={{ display: 'flex', alignItems: 'center ' }}>
                    <div className="d-none d-lg-block d-lg-flex align-items-" style={{ marginLeft: 'auto' }}>
                      {/* <Icon icon="ep:message" className="text-dark" width="24" height="24" /> */}
                      <div className="dropdown ">
                        <button className="btn " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <Icon icon="iconamoon:notification-fill" className="text-dark ms-2 me-2" width="24" height="24" />
                        </button>

                        <ul className="dropdown-menu dropfix">
                          <div className="notification-container">
                            <div className="notifi-header">
                              <a className="dropdown-item" href="#">Notifications</a>
                            </div>

                            <li className="group notifi-main d-flex justify-content-between mx-3 ">
                              <div className="d-flex">
                                <div className="avatar">
                                  <ImageFallback
                                    src="/assets/images/profile-img.png"
                                    alt="img"
                                    className=" user-img img-round"
                                    width={40}
                                    height={40}
                                    priority
                                  />
                                </div>
                                <div className='namedescription m-0 ms-3 '>
                                  <p className="GroupName">John smith</p>
                                  <div className="d-flex ">
                                    <p className="GroupDescrp fs-12">Wordpress Developer</p>

                                  </div>

                                </div>

                              </div>

                              <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                              </div>
                            </li>
                            <li className="group d-flex justify-content-between mx-3 ">
                              <div className="d-flex">
                                <div className="avatar">
                                  <ImageFallback
                                    src={profileImg}
                                    alt="img"
                                    className=" user-img img-round"
                                    width={40}
                                    height={40}
                                    priority
                                  />
                                </div>
                                <div className='namedescription m-0 ms-3 '>
                                  <p className="GroupName">John smith</p>
                                  <div className="d-flex ">
                                    <p className="GroupDescrp fs-12">Wordpress Developer</p>

                                  </div>

                                </div>

                              </div>

                              <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                              </div>
                            </li>
                            <li className="group d-flex justify-content-between mx-3 ">
                              <div className="d-flex">
                                <div className="avatar">
                                  <ImageFallback
                                    src={user?.profilePicture?.fileUrl || profileImg}
                                    fallbackSrc={profileImg}
                                    alt="img"
                                    className=" user-img img-round"
                                    width={40}
                                    height={40}
                                    // priority
                                    loading="lazy"
                                    blurDataURL={profileImageBlurDataURL}
                                  />
                                </div>
                                <div className='namedescription m-0 ms-3 '>
                                  <p className="GroupName">John smith</p>
                                  <div className="d-flex ">
                                    <p className="GroupDescrp fs-12">Wordpress Developer</p>

                                  </div>

                                </div>

                              </div>

                              <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                              </div>
                            </li>
                            <li className="group d-flex justify-content-between mx-3 ">
                              <div className="d-flex">
                                <div className="avatar">
                                  <ImageFallback
                                    src={profileImg}
                                    alt="img"
                                    className=" user-img img-round"
                                    width={40}
                                    height={40}
                                    priority
                                  />
                                </div>
                                <div className='namedescription m-0 ms-3 '>
                                  <p className="GroupName">John smith</p>
                                  <div className="d-flex ">
                                    <p className="GroupDescrp fs-12">Wordpress Developer</p>

                                  </div>

                                </div>

                              </div>

                              <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                              </div>
                            </li>
                            <li className="group d-flex justify-content-between mx-3 ">
                              <div className="d-flex">
                                <div className="avatar">
                                  <ImageFallback
                                    src={profileImg}
                                    alt="img"
                                    className=" user-img img-round"
                                    width={40}
                                    height={40}
                                    priority
                                  />
                                </div>
                                <div className='namedescription m-0 ms-3 '>
                                  <p className="GroupName">John smith</p>
                                  <div className="d-flex ">
                                    <p className="GroupDescrp fs-12">Wordpress Developer</p>

                                  </div>

                                </div>

                              </div>

                              <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                              </div>
                            </li>
                            <li className="group d-flex justify-content-between mx-3 ">
                              <div className="d-flex">
                                <div className="avatar">
                                  <ImageFallback
                                    src={profileImg}
                                    alt="img"
                                    className=" user-img img-round"
                                    width={40}
                                    height={40}
                                    priority
                                  />
                                </div>
                                <div className='namedescription m-0 ms-3 '>
                                  <p className="GroupName">John smith</p>
                                  <div className="d-flex ">
                                    <p className="GroupDescrp fs-12">Wordpress Developer</p>

                                  </div>

                                </div>

                              </div>

                              <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                              </div>
                            </li>
                            <li className="group d-flex justify-content-between mx-3 ">
                              <div className="d-flex">
                                <div className="avatar">
                                  <ImageFallback
                                    src={profileImg}
                                    alt="img"
                                    className=" user-img img-round"
                                    width={40}
                                    height={40}
                                    priority
                                  />
                                </div>
                                <div className='namedescription m-0 ms-3 '>
                                  <p className="GroupName">John smith</p>
                                  <div className="d-flex ">
                                    <p className="GroupDescrp fs-12">Wordpress Developer</p>

                                  </div>

                                </div>

                              </div>

                              <div className='progres text-end'>
                                <Icon icon="system-uicons:cross" className="text-black" />
                                <p className="GroupDescrp fs-10 ">Sun 12pm</p>
                              </div>
                            </li>
                          </div>
                        </ul>
                      </div>
                    </div>
                    <div className="dropdown text-start d-none d-lg-block ">
                      <button className="d-flex align-items-center border-0 bg-transparent  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <ImageFallback
                          src={user?.profilePicture?.fileUrl ? user?.profilePicture.fileUrl : defaultUserImg}
                          // src={user?.profilePicture}
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
                        <li><Link className="dropdown-item" href="/dashboard/profile-setting">Profile Settings</Link></li>
                        <li><span className="dropdown-item" onClick={handleLogout}>Log out</span></li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex d-lg-none gap-2">

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
          </div>
        </nav>
      </header>
    </div>
  );
}
