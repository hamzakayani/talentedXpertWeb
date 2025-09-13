import React, { FC } from "react";
import { Icon } from "@iconify/react";

const RatingStar: FC<any> = ({ rating, data }) => {
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
        <small className="text-white mt-1">{rating}/5</small>
      </div>
      {/* {data?.completedTasks &&  */}
        <small className="text-white">Tasks Completed: {data?.completedTasks?.length || 0}</small>
      {/* } */}
    </div>
  );
};

export default RatingStar;
