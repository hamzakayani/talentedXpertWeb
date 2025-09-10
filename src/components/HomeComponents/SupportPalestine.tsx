import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import Image from "next/image";
import palestine from "../../../public/assets/images/palestine-img.svg";

import {
  AiBrain04Icon,
  ArrowRight02Icon,
  House01FreeIcons,
  SecurityPasswordIcon,
  StarIcon,
  TransparencyIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const SupportPalestine = () => {
  return (
    <section className="how_te_works pb-5">
      <div className="container-fluid">
        <div className="supprtpalestine d-flex gap-4 align-items-center justify-content-between py-2 px-5">
          <div>
            <h4>We support Palestine</h4>
            <p className="fw-normal">
              We are taking action to help our freelancers, our clients, and the
              people of Palestine and so can you.
            </p>
            <div className="mt-4 d-flex align-items-center">
              <button className="btn btn btn-outline-dark w-auto rounded-pill fs-18">
                Learn more <HugeiconsIcon icon={ArrowRight02Icon} />
              </button>
            </div>
          </div>
          <Image className="img-fluid" src={palestine} alt="palestine image" />
        </div>
      </div>
    </section>
  );
};

export default SupportPalestine;
