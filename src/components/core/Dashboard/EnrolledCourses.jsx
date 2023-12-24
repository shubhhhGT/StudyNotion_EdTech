import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEnrolledCourses } from "../../../services/operations/profileAPI";
import Spinner from "../../../common/Spinner";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import Sidebar from "./Sidebar";
import {
  getEntireCart,
  removeFromcart,
} from "../../../services/operations/cartAPI";
import { setTotalItems } from "../../../slices/cartSlice";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);

  const [enrolledCourses, setEnrolledCourses] = useState(null);

  // Media query to check if screen size is greater than 768px
  const isMediumScreenOrLarger = useMediaQuery({ minWidth: 768 });

  const [sidebarIconClicked, setSidebarIconClicked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getEnrolledCourse = async () => {
      setLoading(true);
      try {
        const response = await getEnrolledCourses(token);
        setEnrolledCourses(response);
      } catch (error) {
        console.log("Could not fetch enrolled courses", error);
      }
      setLoading(false);
    };
    getEnrolledCourse();
    console.log("enrolledCourses", enrolledCourses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Something extra start
  const dispatch = useDispatch();
  const { totalItems } = useSelector((state) => state.cart);
  // Get cartItems
  // const [cartItemsArray, setCartItemsArray] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch cart items
        const cartDetails = await getEntireCart(token);
        console.log("cartDetails", cartDetails);
        // setCartItemsArray(cartDetails);

        // Check for common courses
        if (cartDetails && enrolledCourses) {
          let cart = cartDetails?.data?.data?.userDetails?.cartItems;
          console.log("cart", cart);
          const commonCourse = cart.find((cartItem) => {
            return enrolledCourses.some(
              (course) => course._id === cartItem._id
            );
          });

          if (commonCourse) {
            console.log("Common Course", commonCourse);
            // Remove common course from cart
            await removeFromcart({ courseId: commonCourse }, token);
            dispatch(setTotalItems(totalItems - 1));
          } else {
            console.log("No common courses found.");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, enrolledCourses]);
  // useEffect(() => {
  //   // setLoading(true)
  //   const fetchCartItems = async () => {
  //     const cartDetails = await getEntireCart(token);
  //     setCartItemsArray(cartDetails);
  //     // setLoading(false);
  //   };
  //   fetchCartItems();
  //   console.log("CARTiTEMS", cartItemsArray);
  //   // eslint-disable-next-line
  // }, []);

  // const handleCommonCourse = async (commonCourse) => {
  //   await removeFromcart({ courseId: commonCourse }, token);
  //   dispatch(setTotalItems(totalItems - 1));
  // };

  // if (!loading && cartItemsArray) {
  //   let cart = cartItemsArray?.data?.data?.userDetails?.cartItems;
  //   console.log("cart", cart);
  //   const commonCourse = cart.find((cartItem) => {
  //     return enrolledCourses.some((course) => course._id === cartItem._id);
  //   });

  //   if (commonCourse) {
  //     console.log("common Course", commonCourse);
  //     handleCommonCourse(commonCourse);
  //   } else console.log(false);
  // }
  // Something extra end
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

      {/* Works for large screen size */}
      <div className="mb-14 text-3xl font-medium text-richblack-5">
        Enrolled Courses
      </div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <Spinner />
        </div>
      ) : enrolledCourses.length === 0 ? (
        <div className="text-center text-richblack-5">
          You have not enrolled in any course yet.
        </div>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="text-sm sm:text-base flex rounded-t-lg bg-richblack-500">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>

          {/* Cards start here */}
          {enrolledCourses.map((course, index, arr) => {
            return (
              <div
                className={`flex items-center border border-richblack-700 ${
                  index === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                }`}
                key={index}
              >
                {/* Image */}
                <div
                  className="flex flex-col sm:flex-row  w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                  onClick={() =>
                    navigate(
                      `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0].subSection?.[0]._id}`
                    )
                  }
                >
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="sm:h-14 h-16 sm:w-14 w-28 rounded-lg object-cover"
                  />
                  <div className="flex flex-col gap-2 max-w-xs">
                    <p className="font-semibold text-sm sm:text-base">
                      {course.courseName}
                    </p>
                    <p className="sm:text-xs text-[10px] text-richblack-300">
                      {course.courseDescription.length > 50
                        ? `${course.courseDescription.slice(0, 50)}...`
                        : course.courseDescription}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="w-1/4 px-2 py-3 text-richblack-5 text-xs sm:text-base">
                  {course?.totalDuration}
                </div>

                {/* Progress */}
                <div className="w-1/5 flex flex-col gap-2 px-2 py-3">
                  <p className="text-xs sm:text-base">
                    Progress: {course.progressPercentage || 0}%
                  </p>
                  <p>
                    <ProgressBar
                      completed={course.progressPercentage || 0}
                      height="8px"
                      isLabelVisible={false}
                    />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
