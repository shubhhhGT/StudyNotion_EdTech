import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

import { Pagination, FreeMode, Autoplay } from "swiper/modules";
import Course_Card from "./Course_Card";

const CourseSlider = ({ courses }) => {
  return (
    <>
      {courses?.length ? (
        <Swiper
          loop={true}
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Pagination, FreeMode, Autoplay]}
          className="max-h-[30rem]"
          breakpoints={{
            1024: { slidesPerView: 3 },
            640: { slidesPerView: 2 },
          }}
        >
          {courses.map((course, index) => (
            <SwiperSlide key={index}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Courses Found!</p>
      )}
    </>
  );
};

export default CourseSlider;
