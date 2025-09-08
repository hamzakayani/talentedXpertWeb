import React, { useState } from 'react'
import UserTypeButton from '../common/SelectionButton/SelectionButton'
import { HugeiconsIcon } from '@hugeicons/react'
import { Briefcase01Icon, Briefcase05FreeIcons, LaptopIcon, ViewIcon, ViewOffSlashIcon } from '@hugeicons/core-free-icons'

type AccountType = 'INDIVIDUAL' | 'ORGANIZATION'
type ProfileType = 'TR' | 'TE' // TR = Requestor, TE = Xpert

export default function JoinSelection({activeStep, setActiveStep}: {activeStep: number, setActiveStep: (step: number) => void}) {
  const [accountType, setAccountType] = useState<AccountType>('INDIVIDUAL')
  const [profileType, setProfileType] = useState<ProfileType>('TR')

  const isRequestor = profileType === 'TR'
  const isXpert = profileType === 'TE'

  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-5 mx-auto">
            <h2 className="text-center mb-4 text-medium">Join as Xpert or Requestor</h2>
            <div className="d-flex gap-2 mb-3 justify-content-center">
                <UserTypeButton
                    label="Individual"
                    isActive={accountType === "INDIVIDUAL"}
                    onClick={() => setAccountType("INDIVIDUAL")}
                    style={{width:'30%',fontWeight:'400'}}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke={accountType === "INDIVIDUAL" ? "#fff" : "#000"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke={accountType === "INDIVIDUAL" ? "#fff" : "#000"} strokeWidth="1.5" />
                        </svg>
                    }
                />
                <UserTypeButton
                    label="Organization"
                    isActive={accountType === "ORGANIZATION"}
                    onClick={() => setAccountType("ORGANIZATION")}
                    style={{width:'30%',fontWeight:'400'}}
                    icon={
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.5624 13.2702C18.5624 12.5971 18.5617 12.1507 18.5221 11.8101C18.4846 11.4877 18.4187 11.3333 18.3359 11.222C18.2531 11.1107 18.124 11.0034 17.8257 10.8747C17.5109 10.7389 17.0838 10.6098 16.439 10.4163L14.4688 9.82552L14.8644 8.50781L16.8347 9.09953C17.4484 9.28364 17.9658 9.43771 18.3708 9.61247C18.7924 9.79437 19.1592 10.0254 19.4388 10.4011C19.7184 10.7769 19.8342 11.1947 19.8873 11.6508C19.9383 12.0891 19.9374 12.6293 19.9374 13.2702V20.1667H18.5624V13.2702Z" fill={accountType === "ORGANIZATION" ? "#fff" : "#000"}/>
                        <path d="M10.083 11.2292C10.4627 11.2292 10.7705 11.537 10.7705 11.9167C10.7705 12.2964 10.4627 12.6042 10.083 12.6042H7.33301C6.95331 12.6042 6.64551 12.2964 6.64551 11.9167C6.64551 11.537 6.95331 11.2292 7.33301 11.2292H10.083ZM10.083 7.5625C10.4627 7.5625 10.7705 7.8703 10.7705 8.25C10.7705 8.6297 10.4627 8.9375 10.083 8.9375H7.33301C6.95331 8.9375 6.64551 8.6297 6.64551 8.25C6.64551 7.8703 6.95331 7.5625 7.33301 7.5625H10.083Z" fill={accountType === "ORGANIZATION" ? "#fff" : "#000"}/>
                        <path d="M10.3128 17.4167C10.3128 16.9653 10.311 16.6958 10.2851 16.5027C10.2732 16.4142 10.2593 16.3696 10.2511 16.3496C10.2492 16.345 10.2475 16.3415 10.2466 16.3398L10.2457 16.338C10.2454 16.3378 10.2448 16.3375 10.2439 16.3371C10.2421 16.3361 10.2386 16.3345 10.2341 16.3326C10.2141 16.3244 10.1695 16.3105 10.081 16.2986C9.88784 16.2726 9.61841 16.2708 9.167 16.2708H8.25034C7.79893 16.2708 7.5295 16.2726 7.33636 16.2986C7.24784 16.3105 7.20324 16.3244 7.18328 16.3326C7.17871 16.3345 7.17519 16.3361 7.17343 16.3371L7.17164 16.338C7.17144 16.3383 7.1712 16.3389 7.17075 16.3398C7.16983 16.3415 7.16815 16.345 7.16627 16.3496C7.15806 16.3696 7.14415 16.4142 7.13225 16.5027C7.10631 16.6958 7.1045 16.9653 7.1045 17.4167V20.1667H5.7295V17.4167C5.7295 17.004 5.72774 16.6252 5.76889 16.3192C5.8127 15.9933 5.91621 15.6491 6.19947 15.3658C6.48274 15.0825 6.82699 14.979 7.15284 14.9352C7.45892 14.8941 7.83765 14.8958 8.25034 14.8958H9.167C9.57969 14.8958 9.95842 14.8941 10.2645 14.9352C10.5903 14.979 10.9346 15.0825 11.2179 15.3658C11.5011 15.6491 11.6046 15.9933 11.6484 16.3192C11.6896 16.6252 11.6878 17.004 11.6878 17.4167V20.1667H10.3128V17.4167Z" fill={accountType === "ORGANIZATION" ? "#fff" : "#000"}/>
                        <path d="M20.1663 19.4792C20.546 19.4792 20.8538 19.787 20.8538 20.1667C20.8538 20.5464 20.546 20.8542 20.1663 20.8542L1.83301 20.8542C1.45331 20.8542 1.14551 20.5464 1.14551 20.1667C1.14551 19.787 1.45331 19.4792 1.83301 19.4792L20.1663 19.4792Z" fill={accountType === "ORGANIZATION" ? "#fff" : "#000"}/>
                        <path d="M2.0625 20.1666V6.15704C2.0625 5.02768 2.06119 4.1073 2.16008 3.40167C2.26087 2.68256 2.48337 2.04041 3.04989 1.5943C3.62272 1.14333 4.29432 1.09132 5.00228 1.1861C5.69017 1.27823 6.54975 1.52973 7.59562 1.83331L12.179 3.16355C12.8073 3.34593 13.3385 3.49825 13.7545 3.6756C14.1887 3.86079 14.5642 4.09943 14.8493 4.48932C15.1324 4.87679 15.2493 5.30902 15.3031 5.78375C15.3551 6.24237 15.3542 6.80958 15.3542 7.48818V20.1666C15.3542 20.5463 15.0464 20.8541 14.6667 20.8541C14.287 20.8541 13.9792 20.5463 13.9792 20.1666V7.48818C13.9792 6.77821 13.9782 6.30274 13.9371 5.93951C13.8978 5.59281 13.8285 5.42251 13.7393 5.30035C13.6516 5.18047 13.518 5.06982 13.2147 4.94049C12.893 4.80332 12.4564 4.67569 11.7958 4.48395L7.21248 3.15371C6.12285 2.83742 5.38089 2.62371 4.81966 2.54856C4.27835 2.47609 4.05273 2.55479 3.90031 2.67478C3.74186 2.79968 3.6021 3.01842 3.52165 3.59235C3.43927 4.18004 3.4375 4.98541 3.4375 6.15704V20.1666C3.4375 20.5463 3.1297 20.8541 2.75 20.8541C2.37031 20.8541 2.0625 20.5463 2.0625 20.1666Z" fill={accountType === "ORGANIZATION" ? "#fff" : "#000"}/>
                        </svg>
                    }
                />
              </div>

            {/* Selection cards */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <button
                  type="button"
                  onClick={() => setProfileType('TR')}
                  className={`w-100 text-start btn border ${
                    isRequestor ? 'bg-light border-dark' : 'bg-white'
                  }`}
                  style={{ padding: '10px 16px'}}
                >
                    <div className='d-flex justify-content-between mb-2'>
                        <HugeiconsIcon
                            icon={Briefcase05FreeIcons}
                            className=""
                            style={{
                                cursor: "pointer",
                                color: "#000000",
                            }}
                            size={20}
                        />
                        <input
                            className="form-check-input"
                            type="radio"
                            name="profileType"
                            checked={isRequestor}
                            onChange={() => setProfileType('TR')}
                            style={{
                                borderColor: '#000',
                                backgroundColor: isRequestor ? '#000' : 'transparent'
                            }}
                        />
                    </div>
                    <div className="d-flex gap-2">
                    <div>
                        <p className="mb-0 fw-medium">I&apos;m a requestor,</p>
                        <p className="mb-0 fw-medium">hiring for a project</p>
                    </div>
                    </div>
                </button>
              </div>
              <div className="col-12 col-md-6">
                <button
                  type="button"
                  onClick={() => setProfileType('TE')}
                  className={`w-100 text-start btn border ${
                    isXpert ? 'bg-light border-dark' : 'bg-white'
                  }`}
                  style={{ padding: '10px 16px'}}
                >
                <div className='d-flex justify-content-between mb-2'>
                    <HugeiconsIcon
                        icon={LaptopIcon}
                        className=""
                        style={{
                            cursor: "pointer",
                            color: "#000000",
                        }}
                        size={20}
                    />
                    <input
                        className="form-check-input"
                        type="radio"
                        name="profileType"
                        checked={isXpert}
                        onChange={() => setProfileType('TE')}
                        style={{
                            borderColor: '#000',
                            backgroundColor: isXpert ? '#000' : 'transparent'
                        }}
                    />
                </div>
                <div className="d-flex gap-2">
                    <div>
                        <p className="mb-0 fw-medium">I&apos;m a Xpert,</p>
                        <p className="mb-0 fw-medium">looking for work</p>
                    </div>
                </div>
                </button>
              </div>
            </div>

            {/* Continue */}
            <div className="mb-3">
              <button type="button" className="btn btn-black w-100" onClick={() => setActiveStep(activeStep + 1)}>
                Continue
              </button>
            </div>

            <p className="text-center mb-0" style={{ fontSize: '14px' }}>
              Already have an account? <a href="/signin" className=' fw-regular text-black text-decoration-underline'>Log In</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
