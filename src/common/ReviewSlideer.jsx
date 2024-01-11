import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "../App.css";
import { Pagination, FreeMode, Autoplay } from "swiper/modules";
import ReactStars from "react-rating-stars-component";
import { apiConnector } from "../services/apiconnector";
import { ratingsEndpoints } from "../services/apis";
import { FaStar } from "react-icons/fa";

const ReviewSlider = () => {
  const { REVIEWS_DETAILS_API } = ratingsEndpoints;

  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    const fetchAllReviews = async () => {
      const { data } = await apiConnector("GET", REVIEWS_DETAILS_API);
      if (data?.success) {
        setReviews(data?.data);
      }
    };
    fetchAllReviews();
  }, []);
  return (
    <div className="text-richblack-5">
      <div className="h-[184px] my-12  max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          slidesPerView={4}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full "
          breakpoints={{
            940: { slidesPerView: 4 },
            768: { slidesPerView: 3 },
            640: { slidesPerView: 1 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="flex rounded-sm flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25">
                {/* Image userName and course */}
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt={
                      review?.user?.firstName ? review?.user?.firstName : "user"
                    }
                    className="h-9 w-9 object-cover rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-richblack-5">
                      {review?.user?.firstName} {review?.user?.lastName}
                    </p>
                    <p className="text-xs font-medium text-richblack-500">
                      {review?.course?.courseName}
                    </p>
                  </div>
                </div>

                {/* Review */}
                <div className="font-medium text-richblack-25">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review?.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")}...`
                    : `${review?.review}`}
                </div>

                {/* Ratings */}
                <div className="flex items-center gap-2 ">
                  <p className="font-semibold text-yellow-100">
                    {review?.rating.toFixed(1)}
                  </p>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={24}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    filledIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewSlider;
