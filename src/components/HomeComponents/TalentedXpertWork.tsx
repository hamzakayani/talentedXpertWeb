import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import cardImg4 from "../../../public/assets/images/card-img4.png";
import cardImg5 from "../../../public/assets/images/card-image5.png";
import cardImg6 from "../../../public/assets/images/card-image6.png";

const TalentedXpertWork = () => {
  const [activeRole, setActiveRole] = useState<"expert" | "requester">(
    "expert"
  );
  const [isSwitching, setIsSwitching] = useState(false);
  const switchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const content = {
    expert: [
      {
        title: "Get Matched",
        desc: "Set up your profile and let businesses discover your skills instantly.",
        img: cardImg4,
      },
      {
        title: "Do What You Do Best",
        desc: "Apply, collaborate, and deliver high‑quality work with ease.",
        img: cardImg5,
      },
      {
        title: "Get Paid, Hassle‑Free",
        desc: "Complete tasks and receive secure payments — quick, reliable, and transparent.",
        img: cardImg6,
      },
    ],
    requester: [
      {
        title: "Post Your Task",
        desc: "Describe what you need, set your budget, and timeline.",
        img: cardImg4,
      },
      {
        title: "Hire the Right Talent",
        desc: "Review proposals, chat, and choose the best expert for the job.",
        img: cardImg5,
      },
      {
        title: "Pay with Confidence",
        desc: "Fund milestones and release payments once you’re satisfied with the work.",
        img: cardImg6,
      },
    ],
  } as const;

  const handleSwitch = (role: "expert" | "requester") => {
    if (role === activeRole) return;
    setIsSwitching(true);
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    switchTimerRef.current = setTimeout(() => {
      setActiveRole(role);
      setIsSwitching(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    };
  }, []);

  return (
    <section className="how_te_works pb-3 pb-md-5">
      <div className="container-fluid">
        <div className="d-flex align-items-center flex-column gap-3 flex-md-row justify-content-between mb-4">
          <div>
            <h1 className="mb-0 fs-50">How it works</h1>
          </div>
          <div className="d-flex gap-2 rounded-pill overflow-hidden border border-black">
            <button
              className={
                activeRole === "expert"
                  ? "btn btn-dark rounded-pill px-5"
                  : "btn btn-outline-black rounded-pill border-0 px-5"
              }
              aria-pressed={activeRole === "expert"}
              onClick={() => handleSwitch("expert")}
            >
              TalentedXpert
            </button>
            <button
              className={
                activeRole === "requester"
                  ? "btn btn-dark rounded-pill px-5"
                  : "btn btn-outline-black rounded-pill border-0 px-5"
              }
              aria-pressed={activeRole === "requester"}
              onClick={() => handleSwitch("requester")}
            >
              TalentRequestor
            </button>
          </div>
        </div>
        <div
          className="row align-items-stretch gap-lg-0 gap-3"
          style={{
            transition: "opacity 180ms ease, transform 180ms ease",
            opacity: isSwitching ? 0 : 1,
            transform: isSwitching ? "translateY(6px)" : "translateY(0)",
          }}
          key={activeRole}
        >
          {content[activeRole].map((item, idx) => (
            <div className="col-lg-4 d-flex" key={idx}>
              <div className="card bg-gradient2 border-0 rounded-4 overflow-hidden h-100 d-flex flex-column w-100">
                <div className="cardimgwork">
                  <Image
                    className="img-fluid"
                    height={340}
                    src={item.img}
                    alt="card image"
                  />
                </div>
                <div className="card-body">
                  <h4>{item.title}</h4>
                  <p className="text-black lh-21 fw-normal">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TalentedXpertWork;
