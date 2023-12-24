import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Iconbtn from "../../../common/Iconbtn";
import { IoIosArrowBack, IoIosArrowUp } from "react-icons/io";
import { useMediaQuery } from "react-responsive";
import { setReviewModal } from "../../../slices/viewCourseSlice";

const VideoDetailsSidebar = () => {
  const dispatch = useDispatch();
  // For dropdown
  const [activeStatus, setActiveStatus] = useState("");
  // For Highlighted subSection
  const [videobarActive, setVideobarActive] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const { sectionId, subSectionId } = useParams();

  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    (() => {
      if (!courseSectionData.length) return;
      const currentSectionIndex = courseSectionData.findIndex(
        (section) => section._id === sectionId
      );
      const currentSubSectionIndex = courseSectionData?.[
        currentSectionIndex
      ]?.subSection?.findIndex((subSection) => subSection._id === subSectionId);
      const activeSubSectionId =
        courseSectionData?.[currentSectionIndex]?.subSection[
          currentSubSectionIndex
        ]?._id;
      // Set current section
      setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
      // Set current subsection
      setVideobarActive(activeSubSectionId);
    })();
  }, [courseSectionData, courseEntireData, location.pathname]);

  // Responsiveness
  const isMediumScreenOrLarger = useMediaQuery({ minWidth: 768 });

  return (
    <>
      <div
        className={`flex flex-col bg-richblack-800  
      ${
        isMediumScreenOrLarger
          ? "border-r border-r-richblack-700 max-w-[350px] w-[320px]"
          : "rounded-md w-[300px] scroll-auto h-[300px] border border-richblack-700 transition ease-in duration-1000"
      } `}
      >
        {/* Buttons and Heading*/}
        <div className="flex flex-col items-start justify-between gap-2 gap-y-4 mx-5 border-b border-b-richblack-600 py-5 text-richblack-5 font-bold text-lg">
          {/* Buttons */}
          <div className="flex justify-between w-full items-center">
            <div
              onClick={() => navigate("/dashboard/enrolled-courses")}
              title="back"
              className="flex h-[35px] w-[35px] rounded-full items-center bg-richblack-100 justify-center p-1 text-richblack-700 hover:scale-90 cursor-pointer transition-all duration-200 "
            >
              <IoIosArrowBack />
            </div>
            <div>
              <Iconbtn
                customClasses={
                  "ml-auto hover:scale-90 transition-all duration-200"
                }
                text={"Add Review"}
                onclick={() => dispatch(setReviewModal(true))}
              />
            </div>
          </div>

          {/* heading */}
          <div className="flec flex-col items-start justify-between gap-2">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        {/* Sections and subSections */}
        <div className="h-[calc(100vh-5rem)] overflow-y-auto">
          {courseSectionData.map((section, index) => (
            <div
              className="mt-2 text-sm text-richblack-5 cursor-pointer"
              onClick={() => setActiveStatus(section._id)}
              key={index}
            >
              {/* Section */}
              <div className="flex justify-between items-center bg-richblack-600 px-5 py-4">
                <div className="font-semibold w-[70%]">
                  {section?.sectionName}
                </div>
                {/* Icon */}
                <div
                  className={`${
                    activeStatus === section?._id ? "rotate-0" : "rotate-180"
                  } transition-all duration-500`}
                >
                  <IoIosArrowUp />
                </div>
              </div>

              {/* subsections */}
              <div>
                {activeStatus === section._id && (
                  <div className="transition-[height] duration-500 ease-in-out">
                    {section.subSection.map((subSection, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 px-5 py-2 ${
                          videobarActive === subSection._id
                            ? "bg-yellow-200 text-richblack-800 font-semibold"
                            : "hover:bg-richblack-900"
                        }`}
                        onClick={() => {
                          navigate(
                            `/view-course/${courseEntireData._id}/section/${section._id}/sub-section/${subSection._id}`
                          );
                          setVideobarActive(subSection._id);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={completedLectures.includes(subSection?._id)}
                          onChange={() => {}}
                        />
                        <span>{subSection.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoDetailsSidebar;
