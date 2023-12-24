import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RenderSteps from "../AddCourse/RenderSteps";
import Spinner from "../../../../common/Spinner";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import { useMediaQuery } from "react-responsive";
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import Sidebar from "../Sidebar";

const EditCourse = () => {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const [sidebarIconClicked, setSidebarIconClicked] = useState(false);

  const { isMediumScreenOrLarger } = useMediaQuery({ minWidth: 640 });

  useEffect(() => {
    const populateCourseDetails = async () => {
      setLoading(true);
      const result = await getFullDetailsOfCourse(courseId, token);
      if (result?.courseDetails) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(result?.courseDetails));
      }
      setLoading(false);
    };

    populateCourseDetails();
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-5.5rem)] w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {/* Responsive design for small screen */}
      <div className="mb-4 md:hidden">
        {!isMediumScreenOrLarger &&
          (sidebarIconClicked ? (
            <div className="flex">
              <GoSidebarExpand
                size={24}
                fill="#AFB2BF"
                onClick={() => setSidebarIconClicked(!sidebarIconClicked)}
              />
              <Sidebar />
            </div>
          ) : (
            <GoSidebarCollapse
              size={24}
              fill="#AFB2BF"
              onClick={() => setSidebarIconClicked(!sidebarIconClicked)}
            />
          ))}
      </div>

      {/* Edit Section */}
      <h1 className="text-3xl mb-14 font-medium text-richblack-5">
        Edit Course
      </h1>
      <div className="mx-auto max-w-[600px]">
        {course ? <RenderSteps /> : <p>Course Not Found</p>}
      </div>
    </div>
  );
};

export default EditCourse;
