import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { createRating } from "../../../services/operations/courseDetailsAPI";
import Iconbtn from "../../../common/Iconbtn";
import { setReviewModal } from "../../../slices/viewCourseSlice";

const CourseReviewModal = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", 0);
  }, []);

  const onSubmit = async (data) => {
    // Create a rating
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    );
    // Close modal
    dispatch(setReviewModal(false));
  };

  const ratingChange = (newRating) => {
    setValue("courseRating", newRating);
  };
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800 ">
        {/* Modal Heading */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">Add Review</p>
          <button onClick={() => dispatch(setReviewModal(false))}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        <div className="p-6">
          {/* user Image and name*/}
          <div className="flex items-center justify-center gap-x-4">
            <div className="w-[50px] h-[50px] rounded-full flex items-center">
              <img
                src={user?.image}
                alt={user?.firstName}
                className=" aspect-square w-[50px] rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-richblack-5">{`${user.firstName} ${user.lastName}`}</p>
              <p className="text-richblack-5 text-sm">Posting Publicly</p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center"
          >
            {/* Stars */}
            <ReactStars
              count={5}
              onChange={ratingChange}
              activeColor="#ffd700"
              size={24}
            />
            <div className="flex flex-col w-11/12 space-y-2">
              <label
                htmlFor="courseExperience"
                className="text-richblack-5 text-sm"
              >
                Add Your Experience
                <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="add your experience"
                {...register("courseExperience", { required: true })}
                className="form-style !bg-richblack-700 resize-x-none min-h-[130px] w-full"
              />
              {errors.courseExperience && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  This field is required
                </span>
              )}
            </div>

            {/* buttons */}
            <div className="mt-6 flex w-11/12 justify-end gap-x-2">
              {/* cancel button */}
              <button
                className="cursor-pointer rounded-md bg-richblack-300 py-2 px-5 font-semibold text-richblack-900 "
                type="button"
                onClick={() => dispatch(setReviewModal(false))}
              >
                Cancel
              </button>
              <Iconbtn>Save</Iconbtn>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;
