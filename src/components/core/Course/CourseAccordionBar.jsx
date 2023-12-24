import React, { useEffect, useState, useRef } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { convertSecondsToDuration } from "../../../utils/convertToDuration";
import SubSecAccordion from "./SubSecAccordion";

const CourseAccordionBar = ({ course, isActive, handleActive }) => {
  const [sectionTotalTime, setSectionTotalTime] = useState(0);
  const [active, setActive] = useState(false);
  const [sectionHeight, setSectionHeight] = useState(0);

  const contentElement = useRef(null);

  useEffect(() => {
    setActive(isActive?.includes(course._id));
  }, [isActive]);

  useEffect(() => {
    setSectionHeight(active ? contentElement.current.scrollHeight : 0);
  }, [active]);

  useEffect(() => {
    let totalTime = 0;
    course.subSection.forEach((subSec) => {
      totalTime += parseInt(subSec.timeDuration);
    });
    let convertedTime = convertSecondsToDuration(totalTime);
    setSectionTotalTime(convertedTime);
  }, [course]);
  return (
    <div className="border border-solid overflow-hidden border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0">
      <div
        onClick={() => handleActive(course._id)}
        className="flex cursor-pointer justify-between items-start bg-opacity-20 px-7 py-6 transition-[0.3s]"
      >
        {/* Section name and arrow */}
        <div className="flex items-center gap-2">
          <i
            className={
              isActive.includes(course._id) ? "rotate-180" : "rotate-0"
            }
          >
            <AiOutlineDown />
          </i>
          <p className="text-richblack-5">{course?.sectionName}</p>
        </div>

        {/* Section time and total lecture */}
        <div className="flex space-x-4">
          {/* total lecture for a section */}
          <div className="text-yellow-25">{`${
            course?.subSection.length || 0
          } lecture(s)`}</div>
          {/* Total time for a section */}
          <div className="text-richblack-100">{sectionTotalTime}</div>
        </div>
      </div>

      {/* Subsection */}
      <div
        ref={contentElement}
        style={{
          height: sectionHeight,
        }}
        className="h-0 overflow-hidden bg-richblack-900 transition-[height] duration-[0.35s] ease-[ease]"
      >
        <div className="flex flex-col gap-2 px-6 py-7 font-semibold">
          {course?.subSection?.map((subSec, i) => {
            return <SubSecAccordion subSec={subSec} key={i} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseAccordionBar;
