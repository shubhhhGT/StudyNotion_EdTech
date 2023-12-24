import React, { useEffect, useState } from "react";
import RatingStars from "../../../common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";
import { Link } from "react-router-dom";

const Course_Card = ({ course, Height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
    // eslint-disable-next-line
  }, [course]);

  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div>
          <div className="">
            <img
              src={course?.thumbnail}
              alt={course?.name}
              className={`h-[250px] sm:${Height} w-full rounded-lg object-cover`}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            {/* Name */}
            <p className="text-xl text-richblack-5">{course?.courseName}</p>

            {/* instructor */}
            <p className="text-sm text-richblack-50">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>

            {/* ratings */}
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews.length} Ratings
              </span>
            </div>

            {/* Price */}
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Course_Card;
