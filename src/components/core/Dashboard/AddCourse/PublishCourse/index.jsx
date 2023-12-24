import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Iconbtn from "../../../../../common/Iconbtn";
import { IoIosArrowBack } from "react-icons/io";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";
import { useNavigate } from "react-router-dom";

export const PublishCourse = () => {
  const { register, getValues, setValue, handleSubmit } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  const [loading, setLoading] = useState(false);

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

  const handleCoursePublish = async () => {
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      // This condition states that there is no updates made to the course
      // No need to make an API call
      goToCourses();
      return;
    }

    // if Form is updated
    const formData = new FormData();
    formData.append("courseId", course._id);
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT;
    formData.append("status", courseStatus);

    setLoading(true);

    // api call
    const result = await editCourseDetails(formData, token);

    if (result) {
      goToCourses();
    }

    setLoading(false);
  };

  const onSubmit = () => {
    handleCoursePublish();
  };

  const goBack = () => {
    dispatch(setStep(2));
  };

  return (
    <div className="border rounded-md border-richblack-700 bg-richblack-800 p-6">
      <div className="text-2xl font-semibold text-richblack-5">
        Publish Course
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="rounded h-4 w-4 border-pure-greys-300 text-richblack-400 focus:ring-2 focus:ring-yellow-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this Course as Public
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end items-center gap-x-4">
          <button
            type="button"
            onClick={goBack}
            disabled={loading}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-2 px-3 font-semibold text-richblack-900"
          >
            <IoIosArrowBack />
            Back
          </button>
          <Iconbtn text="Save Changes" type="submit" disabled={loading} />
        </div>
      </form>
    </div>
  );
};
