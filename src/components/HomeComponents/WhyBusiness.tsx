import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import Image from "next/image";
import marketplace from "../../../public/assets/images/marketplace.png";

import {
  AiBrain04Icon,
  House01FreeIcons,
  SecurityPasswordIcon,
  StarIcon,
  TransparencyIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const WhyBusiness = () => {
  return (
    <section className="how_te_works pb-5">
      <div className="container-fluid">
        <div className="row h-100">
          <div className="col-lg-7">
            <div className="card rounded-4 overflow-hidden p-2 h-100 border-black pt-4">
              <div className="card-body">
                <h1 className="fs-50">Why businesess turn to TalentedXperts</h1>

                <ul className="list-group mt-5">
                  <li className="list-group-item">
                    <div className="listicon">
                      <HugeiconsIcon icon={AiBrain04Icon} size={38} />
                    </div>
                    <div className="listtext">
                      <h4 className="mb-1">AI-Driven</h4>
                      <p className="fw-normal">
                        Get paired with the right TalentedXpert faster. Our
                        smart system understands your needs and connects you
                        with the best fit — whether local or online.
                      </p>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="listicon">
                      <HugeiconsIcon icon={TransparencyIcon} size={38} />
                    </div>
                    <div className="listtext">
                      <h4 className="mb-1">Transparency</h4>
                      <p className="fw-normal">
                        See team members and review detailed profiles, real work
                        samples, and verified client feedback before you hire.
                        No guesswork, just clarity.
                      </p>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="listicon">
                      <HugeiconsIcon icon={SecurityPasswordIcon} size={38} />
                    </div>
                    <div className="listtext">
                      <h4 className="mb-1">Safe and secure</h4>
                      <p className="fw-normal">
                        From identity checks to secure payments, we protect both
                        clients & TalentedXperts at every step.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card bg-gradient2 border-0 rounded-4 overflow-hidden h-100">
              <div className="cardimgbusiness m-auto">
                <Image
                  className="img-fluid"
                  src={marketplace}
                  alt="card image"
                />
              </div>
              <div className="card-body pt-0">
                <h3 style={{ marginTop: "-28px" }}>
                  We’re <br /> the world’s 1st work <br /> marketplace for
                  everybody
                </h3>
                <ul className="list-group mt-5">
                  <li className="list-group-item">
                    <div className="listicon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M11.8289 19.1274L6.27626 23.3407C6.00112 23.5644 5.70098 23.6698 5.37582 23.6568C5.05066 23.6449 4.76302 23.5519 4.5129 23.3779C4.26278 23.2039 4.06919 22.9678 3.93212 22.6695C3.79405 22.3712 3.78755 22.0481 3.91261 21.7001L6.05115 14.8023L0.61101 10.9619C0.310865 10.763 0.123274 10.5021 0.0482376 10.1789C-0.0267988 9.85577 -0.0142926 9.55749 0.0857559 9.28406C0.185804 9.01064 0.360889 8.76803 0.61101 8.55625C0.861132 8.34546 1.16128 8.24007 1.51145 8.24007H8.2272L10.4033 1.08128C10.5283 0.733279 10.7224 0.465819 10.9855 0.278895C11.2477 0.0929653 11.5288 0 11.8289 0C12.1291 0 12.4102 0.0929653 12.6724 0.278895C12.9355 0.465819 13.1296 0.733279 13.2546 1.08128L15.4307 8.24007H22.1464C22.4966 8.24007 22.7968 8.34546 23.0469 8.55625C23.297 8.76803 23.4721 9.01064 23.5721 9.28406C23.6722 9.55749 23.6847 9.85577 23.6097 10.1789C23.5346 10.5021 23.347 10.763 23.0469 10.9619L17.6067 14.8023L19.7453 21.7001C19.8703 22.0481 19.8643 22.3712 19.7273 22.6695C19.5892 22.9678 19.3951 23.2039 19.145 23.3779C18.8949 23.5519 18.6072 23.6449 18.2821 23.6568C17.9569 23.6698 17.6568 23.5644 17.3816 23.3407L11.8289 19.1274Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div className="listtext">
                      <h5 className="mb-1">4.9/5</h5>
                      <p className="fw-normal">
                        Clients rate professionals on TalentedXpert
                      </p>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="listicon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="27"
                        viewBox="0 0 25 27"
                        fill="none"
                      >
                        <path
                          d="M13.0527 0C14.053 7.72415e-06 15.0271 0.112114 15.9629 0.325195L13.9502 6.58887C13.6568 6.5485 13.3573 6.52637 13.0527 6.52637C9.44835 6.52637 6.52637 9.44835 6.52637 13.0527C6.52642 16.6571 9.44838 19.5791 13.0527 19.5791C14.6968 19.5791 16.1972 18.9691 17.3447 17.9658L20.3115 23.9004C18.2358 25.2921 15.7395 26.1054 13.0527 26.1055C5.844 26.1055 5.56634e-05 20.2615 0 13.0527C0 5.84396 5.84396 0 13.0527 0ZM24.8818 16.7236L21.6182 22.4346L18.7627 16.7236H12.2373L15.5 11.4209H21.6182L24.8818 16.7236ZM19.3535 2.03906C20.9529 2.03906 22.0264 2.8499 22.0264 4.2207C22.026 6.11042 19.8361 7.02469 18.8809 7.93848V7.95898H22.0264V9.38184H16.3154C16.3154 8.1876 16.9595 7.44955 17.6143 6.91992C18.9453 5.85028 20.2012 5.28975 20.2012 4.34473C20.2011 3.79439 19.8794 3.46191 19.2998 3.46191C18.6022 3.46193 18.1407 3.83594 18.1406 4.82227H16.4229C16.423 3.14008 17.3464 2.03907 19.3535 2.03906Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div className="listtext">
                      <h5 className="mb-1">Built for Everybody</h5>
                      <p className="fw-normal">
                        Freelancing designed for both local and online work{" "}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBusiness;
