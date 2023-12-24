import React from "react";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { convertSecondsToDuration } from "../../../utils/convertToDuration";

const SubSecAccordion = ({ subSec }) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-richblack-100">
          <HiOutlineVideoCamera />
          <p>{subSec?.title}</p>
        </div>

        <div className="text-richblack-100">
          {convertSecondsToDuration(subSec.timeDuration)}{" "}
        </div>
      </div>
    </div>
  );
};

export default SubSecAccordion;
