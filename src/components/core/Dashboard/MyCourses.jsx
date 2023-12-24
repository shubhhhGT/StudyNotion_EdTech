import React, { useEffect, useState } from "react";
import Iconbtn from "../../../common/Iconbtn";
import { VscAdd } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import InstructorCourses from "./InstructorDashboard/InstructorCourses";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import Sidebar from "./Sidebar";

const MyCourses = () => {
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);

  // Get the courses whnever the component renders
  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
    };
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Media query to check if screen size is greater than 768px
  const isMediumScreenOrLarger = useMediaQuery({ minWidth: 768 });

  const [sidebarIconClicked, setSidebarIconClicked] = useState(false);

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

      {/* My Course */}
      <div className="mb-14 flex items-center justify-between">
        <h2 className="text-3xl font-medium text-richblack-5">My Courses</h2>
        <Iconbtn
          text={"Add Course"}
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </Iconbtn>
      </div>
      {courses && (
        <InstructorCourses courses={courses} setCourses={setCourses} />
      )}
    </div>
  );
};

export default MyCourses;
