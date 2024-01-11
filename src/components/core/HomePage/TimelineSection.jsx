import React from "react";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import timelineimage from "../../../assets/Images/TimelineImage.webp";

const TimelineSection = () => {
  const Timeline = [
    {
      Logo: Logo1,
      heading: "Leadership",
      Description: "Fully committed to the success company",
    },
    {
      Logo: Logo2,
      heading: "Responsibility",
      Description: "Students will always be our top priority",
    },
    {
      Logo: Logo3,
      heading: "Flexibility",
      Description: "The ability to switch is an important skills",
    },
    {
      Logo: Logo4,
      heading: "Solve the problem",
      Description: "Code your way to a solution",
    },
  ];

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-20 mb-20 items-center">
        {/* Left Box */}
        <div className="lg:w-[45%] flex flex-col gap-2 lg:gap-3">
          {Timeline.map((element, index) => {
            return (
              <div className="flex flex-col lg:gap-3 " key={index}>
                <div className="flex flex-row gap-5" key={index}>
                  {/* Logo */}
                  <div className="w-[50px] h-[50px] rounded-full justify-center bg-white flex items-center">
                    <img src={element.Logo} alt="logo" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-[18px]">
                      {element.heading}
                    </h2>
                    <p className="text-base">{element.Description}</p>
                  </div>
                </div>
                <div
                  className={`${
                    Timeline.length - 1 === index ? "hidden" : "block"
                  } h-14 border-dotted border-r border-richblack-100 bg-richblack-400/0 w-[26px]`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Right box */}
        <div className="relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]">
          {/* green box */}
          <div className="absolute lg:left-[50%] lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[50%] bg-caribbeangreen-700 flex lg:flex-row flex-col text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10 ">
            <div className="flex gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14">
              <p className="text-3xl font-bold w-[75px]">10</p>
              <p className="text-sm text-caribbeangreen-100 w-[75px]">
                Years of Experience
              </p>
            </div>

            <div className="flex items-center gap-5 lg:px-14 px-7">
              <p className="text-3xl font-bold w-[75px]">250</p>
              <p className="text-sm text-caribbeangreen-100 w-[75px]">
                Types of Courses
              </p>
            </div>
          </div>
          {/* Timeline image */}
          <img
            className="shadow-white shadow-[20px_20px_0px_0px] object-cover h-[400px] lg:h-fit"
            src={timelineimage}
            alt="timelineimage"
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
