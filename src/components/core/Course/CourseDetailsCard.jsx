import React from "react";
import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import toast from "react-hot-toast";
import copy from "copy-to-clipboard";
import { addTocart } from "../../../services/operations/cartAPI";
import { setTotalItems } from "../../../slices/cartSlice";

const CourseDetailsCard = ({
  course,
  handleBuyCourse,
  setConfirmationModal,
}) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    // Check if the instructor is trying to buy a course
    // If so, show error
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are Instructor. You can't buy a course");
      return;
    }

    // if the user is logged in then dispatch add to cart else asl to login first
    if (token) {
      const res = await addTocart({ courseId: course }, token);
      if (res) {
        dispatch(setTotalItems(totalItems + 1));
      }
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add courses to your cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <>
      <div className="flex flex-col bg-richblack-700 rounded-md text-richblack-5 gap-4 p-4">
        {/* Course Image */}
        <img
          src={course.thumbnail}
          alt={course.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover "
        />

        <div className="px-4">
          {/* Course price */}
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            Rs. {course.price}
          </div>

          {/* buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={
                user && course?.studentsEntrolled.includes(user._id)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
              className="cursor-pointer w-full px-4 py-2 bg-yellow-50 hover:scale-105 rounded-md text-richblack-800"
            >
              {user && course?.studentsEntrolled.includes(user._id)
                ? "Go To Course"
                : "Buy Now"}
            </button>
            {(!user || !course?.studentsEntrolled.includes(user._id)) && (
              <button
                onClick={handleAddToCart}
                className="cursor-pointer w-full px-4 py-2 bg-richblack-800 hover:scale-105 rounded-md text-richblack-5 hover:text-yellow-50"
              >
                Add to Cart
              </button>
            )}
          </div>

          <p className="text-sm text-richblack-25 pb-3 pt-6 text-center ">
            30-Day Money-back Guarantee
          </p>

          {/* Course instructions */}
          <div>
            <p className="my-2 text-xl font-semibold">This Course Includes:</p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.whatYouWillLearn.split(".").map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <BsFillCaretRightFill />
                  <p>{item.trim()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Share btn */}
          <div className="text-center">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-yellow-100 py-6 mx-auto"
            >
              <FaShareSquare size={15} />
              <p> Share</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailsCard;
