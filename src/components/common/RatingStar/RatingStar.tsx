import React, { FC } from "react";
import { Icon } from "@iconify/react";

const RatingStar: FC<any> = ({ rating }) => {
  return (
    <div>
      <div className="d-flex align-items-center gap-2">
        <div className="rating">
          {[...Array(5)].map((_, index) => (
            <Icon
              key={index}
              icon="material-symbols-light:kid-star"
              className={`text-light ${index < rating ? "rated" : ""}`}
            />
          ))}
        </div>
        <small className="text-white mt-1">4/5</small>
      </div>
      <small className="text-white">Tasks Completed: 203</small>
    </div>
  );
};

export default RatingStar;
