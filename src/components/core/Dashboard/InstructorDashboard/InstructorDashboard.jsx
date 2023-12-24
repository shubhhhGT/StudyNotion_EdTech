import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import Spinner from "../../../../common/Spinner";
import { Link, useNavigate } from "react-router-dom";
import InstructorChart from "./InstructorChart";
import { useMediaQuery } from "react-responsive";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import Sidebar from "../Sidebar";

const InstructorDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const instructorApiData = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);

      console.log("instructorApiData", instructorApiData);
      console.log("result", result);

      if (instructorApiData.length) {
        setInstructorData(instructorApiData);
      }
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    })();
  }, []);

  const totalAmountGenerated = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0
  );
  const totalStudentsEnrolled = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudents,
    0
  );

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

      {/* Hello */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hii {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>

      {loading ? (
        <div className="grid place-items-center h-[calc(100vh-3.5rem)]">
          <Spinner />
        </div>
      ) : courses ? (
        <div>
          {/* Charts and statistics */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 my-4 h-auto sm:h-[450px]">
            {/* Pie chart */}
            {totalStudentsEnrolled > 0 || totalAmountGenerated > 0 ? (
              <InstructorChart courses={instructorData} />
            ) : (
              <div className="flex-1 roumd bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}

            {/* statistics part */}
            <div className="flex flex-col space-y-4 min-w-[250px] my-4 sm:my-0 rounded-md bg-richblack-800 p-6 ">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="flex flex-col">
                <p className="text-lg text-richblack-200">Total Courses</p>
                <p className="text-3xl font-semibold text-richblack-50">
                  {courses.length}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-lg text-richblack-200">Total Students</p>
                <p className="text-3xl font-semibold text-richblack-50">
                  {totalStudentsEnrolled}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-lg text-richblack-200">Total Income</p>
                <p className="text-3xl font-semibold text-richblack-50">
                  Rs. {totalAmountGenerated}
                </p>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="rounded-md bg-richblack-800 md:p-6 p-2">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <button
                onClick={() => navigate("/dashboard/my-courses")}
                className="text-xs font-semibold text-yellow-50"
              >
                View All
              </button>
            </div>

            {/* Course cards */}
            <div className="my-4 flex flex-col md:flex-row items-center space-x-6 gap-y-4 md:gap-y-0">
              {courses.slice(0, 3).map((course) => (
                <div className="w-[80%] md:w-1/3" key={course?._id}>
                  {/* Image */}
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="md:h-[210px] h-[250px] w-full rounded-md object-cover "
                  />
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50">
                      {course?.courseName}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs font-medium text-richblack-300">
                        {course?.studentsEntrolled?.length} students
                      </p>
                      <p className="text-sm font-medium text-richblack-300">
                        |
                      </p>
                      <p className="text-sm font-medium text-richblack-300">
                        Rs. {course?.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-csnter text-2xl font-bold text-richblack-5">
            You have not created any course yet!
          </p>
          <Link to={"/dashboard/add-course"}>
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a Course
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
