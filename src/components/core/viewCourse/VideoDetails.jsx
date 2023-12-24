import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { Player, BigPlayButton } from "video-react";
import Iconbtn from "../../../common/Iconbtn";
import "video-react/dist/video-react.css";
import { useMediaQuery } from "react-responsive";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import VideoDetailsSidebar from "./VideoDetailsSidebar";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const playerRef = useRef();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewSource, setPreviewSource] = useState("");

  useEffect(() => {
    (async () => {
      if (!courseSectionData.length) return;
      if (!courseId && !sectionId && !subSectionId) {
        navigate("/dashboard/enrolled-courses");
      } else {
        const filteredData = courseSectionData.filter(
          (section) => section._id === sectionId
        );
        console.log("filteredData", filteredData);

        if (filteredData.length > 0) {
          const filteredVideoData = filteredData[0].subSection.filter(
            (subSection) => subSection._id === subSectionId
          );

          setVideoData(filteredVideoData[0]);
          setPreviewSource(courseEntireData.thumbnail);
          setVideoEnded(false);
        }
      }
    })();
  }, [courseSectionData, courseEntireData, location.pathname]);

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((subSection) => subSection._id === subSectionId);

    if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
      return true;
    } else {
      return false;
    }
  };

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((subSection) => subSection._id === subSectionId);

    const noOfSubSections =
      courseSectionData[currentSectionIndex].subSection.length;

    if (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === noOfSubSections - 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  const gotToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((subSection) => subSection._id === subSectionId);

    const noOfSubSections =
      courseSectionData[currentSectionIndex].subSection.length;

    // Check if current subsection index is not equal to the last video index
    if (currentSubSectionIndex !== noOfSubSections - 1) {
      // Go to next video of same section
      const nextSubSectionId =
        courseSectionData[currentSubSectionIndex].subSection[
          currentSubSectionIndex + 1
        ]._id;
      // Go to the video
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else {
      //if current section index is equal to the last video index
      //  Go to the first video of next section
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubSectionId =
        courseSectionData[currentSectionIndex + 1].subSection[0]._id;

      // Go to this video
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      );
    }
  };
  const gotToPrevVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    );
    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((subSection) => subSection._id === subSectionId);

    if (currentSubSectionIndex !== 0) {
      // previous video of same sec
      const prevSubSectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentSubSectionIndex - 1
        ]._id;
      // go to this video
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      );
    } else {
      // last video of other section
      const prevSecId = courseSectionData[currentSectionIndex - 1]._id;
      const prevSubSecLength =
        courseSectionData[currentSectionIndex - 1].subSection.length;
      const prevSubSecId =
        courseSectionData[currentSectionIndex - 1].subSection[
          prevSubSecLength - 1
        ]._id;

      // Go to this video
      navigate(
        `/view-course/${courseId}/section/${prevSecId}/sub-section/${prevSubSecId}`
      );
    }
  };

  const handleLectureComplete = async () => {
    setLoading(true);

    const res = await markLectureAsComplete(
      { courseId: courseId, subSectionId: subSectionId },
      token
    );
    // state update
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }

    setLoading(false);
  };

  // Responsive design for small screens
  const isMediumScreenOrLarger = useMediaQuery({ minWidth: 768 });
  const [sidebarIconClicked, setSidebarIconClicked] = useState(false);

  return (
    <>
      {/* Responsive design for small screen */}
      <div className="my-4 md:hidden">
        {!isMediumScreenOrLarger &&
          (sidebarIconClicked ? (
            <div className="flex">
              <GoSidebarExpand
                size={24}
                fill="#AFB2BF"
                onClick={() => setSidebarIconClicked(!sidebarIconClicked)}
              />
              <div
                className={`${
                  sidebarIconClicked ? "w-full" : "w-0"
                } overflow-hidden transition ease-in-out duration-1000`}
              >
                <VideoDetailsSidebar />
              </div>
            </div>
          ) : (
            <GoSidebarCollapse
              size={24}
              fill="#AFB2BF"
              onClick={() => setSidebarIconClicked(!sidebarIconClicked)}
            />
          ))}
      </div>

      {/* Code for medium screen or larger */}
      <div className="flex flex-col gap-5 text-white">
        {!videoData ? (
          <img
            src={previewSource}
            alt="preview"
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          <Player
            ref={playerRef}
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
            aspectRatio="16:9"
          >
            <BigPlayButton position="center" />
            {/* renders when video ends */}
            {videoEnded && (
              <div
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgb(0,0,0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1))",
                }}
                className="w-full h-full grid place-content-center inset-0 z-[100] font-inter absolute "
              >
                {!completedLectures.includes(subSectionId) && (
                  <Iconbtn
                    disabled={loading}
                    customClasses="text-xl max-w-max px-4 mx-auto"
                    onclick={() => handleLectureComplete()}
                    text={!loading ? "Mark As Completed" : "Loading..."}
                  />
                )}

                <Iconbtn
                  disabled={loading}
                  customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                  onclick={() => {
                    if (playerRef?.current) {
                      playerRef?.current?.seek(0);
                      playerRef?.current?.play();
                      setVideoEnded(false);
                    }
                  }}
                  text={"Rewatch"}
                />

                <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                  {!isFirstVideo() && (
                    <button
                      className="font-semibold text-lg rounded-md px-4 py-3 bg-richblack-800 text-richblack-5 hover:text-yellow-100 hover:scale-95 transition-all duration-200"
                      disabled={loading}
                      onClick={gotToPrevVideo}
                    >
                      Prev
                    </button>
                  )}
                  {!isLastVideo() && (
                    <button
                      className="font-semibold text-lg rounded-md px-4 py-3 bg-richblack-800 text-richblack-5 hover:text-yellow-100 hover:scale-95 transition-all duration-200"
                      disabled={loading}
                      onClick={gotToNextVideo}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </Player>
        )}

        {/* Title */}
        <div className="mt-4 text-3xl font-semibold">{videoData?.title}</div>
        {/* Desc */}
        <p className="pt-2 pb-6">{videoData?.description}</p>
      </div>
    </>
  );
};

export default VideoDetails;
