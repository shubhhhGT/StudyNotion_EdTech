import React from "react";
import instructor from "../../../assets/Images/Instructor.webp";
import HighlightText from "./HighlightText";
import CTAButton from "./Button";
import { FaArrowRight } from "react-icons/fa";

const InstructorSection = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-20 items-center">
        {/* Left container */}
        <div className="lg:w-[50%]">
          <img
            src={instructor}
            alt="instructor_image"
            className="shadow-white shadow-[-20px_-20px_0_0]"
          />
        </div>

        {/* Right container */}
        <div className="lg:w-[50%] flex-col flex gap-10">
          <div className="lg:w-[50%] text-4xl font-semibold">
            Become an
            <HighlightText text={"Instructor"} />
          </div>

          <div className="text-base font-medium text-justify w-[90%] text-richblack-300">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.
          </div>

          <div className="w-fit">
            <CTAButton active={true} linkto={"/signup"}>
              <div className="flex items-center gap-3">
                Start Teaching Today
                <FaArrowRight />
              </div>
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
