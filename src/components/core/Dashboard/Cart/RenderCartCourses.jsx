import React from "react";
import { useSelector } from "react-redux";
import { FaRegTrashAlt } from "react-icons/fa";
import GetAvgRating from "../../../../utils/avgRating";
import RatingStars from "../../../../common/RatingStars";
import { removeFromcart } from "../../../../services/operations/cartAPI";

const RenderCartCourses = ({ loading, cart, setCartUpdated }) => {
  const { token } = useSelector((state) => state.auth);

  const handleClick = async (course) => {
    await removeFromcart({ courseId: course }, token);
    setCartUpdated((prev) => !prev);
  };

  return (
    <div className="flex flex-col flex-1">
      {!loading &&
        cart.map((course, index) => {
          return (
            <div
              className={`flex w-full flex-wrap items-start justify-between gap-6 ${
                index !== cart.length - 1 &&
                "border-b border-richblack-400 pb-6"
              } ${index !== 0 && "mt-6"}`}
              key={index}
            >
              <div className="flex flex-1 flex-col lg:flex-row gap-4">
                <img
                  className="h-[148px] w-[220px] rounded-lg object-cover "
                  src={course?.thumbnail}
                  alt={course?.courseName}
                />
                <div className="flex flex-col space-y-1">
                  <p className="text-lg font-medium text-richblack-5">
                    {course?.courseName}
                  </p>
                  <p className="text-sm text-richblack-300">
                    {course?.category?.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-50">
                      {GetAvgRating(course.ratingAndReviews)}
                    </span>
                    <RatingStars
                      Review_Count={GetAvgRating(course.ratingAndReviews)}
                      Star_Size={15}
                    />
                    {/* <ReactStars
                    count={5}
                    size={20}
                    edit={false}
                    activeColor={"#ffd700"}
                    emptyIcon={<FaRegStar />}
                    fullIcon={<FaStar />}
                  /> */}
                    <span className="text-richblack-400">
                      {course?.ratingAndReviews?.length} Ratings
                    </span>
                  </div>
                  <div className="text-richblack-400 text-sm">
                    {course?.category?.name} • Beginner
                  </div>
                  {/* Media */}
                  <div className="flex xl:hidden items-center space-x-2">
                    <button
                      className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-2 px-[8px] text-pink-200"
                      onClick={() => handleClick(course)}
                    >
                      <FaRegTrashAlt />
                      <span>Remove</span>
                    </button>
                    <p className="text-xl font-medium text-yellow-100">
                      Rs {course?.price}
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden xl:flex flex-col items-start space-y-2">
                <button
                  className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
                  onClick={() => handleClick(course)}
                >
                  <FaRegTrashAlt />
                  <span>Remove</span>
                </button>
                <p className="mb-6 text-3xl font-medium text-yellow-100">
                  Rs {course?.price}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default RenderCartCourses;
