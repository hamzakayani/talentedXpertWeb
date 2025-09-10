import { clientTest } from "@/services/helpers/staticdata";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";
import ClientTestimonialSlider from "../common/sliders/ClientTestimonialSlider";

const ClientTestimonial = () => {
  return (
    <section className="promoted_te_section py-5">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="mb-0 fs-50">{`Client Wins with TalentedXpert`}</h1>
          </div>
        </div>
        <ClientTestimonialSlider />
      </div>
    </section>
  );
};

export default ClientTestimonial;
