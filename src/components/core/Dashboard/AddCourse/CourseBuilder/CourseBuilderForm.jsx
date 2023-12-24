import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Iconbtn from "../../../../../common/Iconbtn";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";
import NestedView from "./NestedView";

const CourseBuilderForm = () => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [editSectionName, setEditSectionName] = useState(null);
  const [loading, setLoading] = useState(false);

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  // To go back we need to set the step in slice as 1. Also the course will be marked as being edited
  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  //   To go to the next step make sure that at least 1 section in the course exists
  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add at least one section");
      return;
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add at least one lecture in each section");
      return;
    }
    // if everything is fine
    dispatch(setStep(3));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    // If section is being edited, call the editSection api else call create section api
    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      );
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      );
    }

    // Update values
    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }

    setLoading(false);
  };

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }

    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return (
    <div className="space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input field */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="sectionName" className="text-sm text-richblack-5">
            Section name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            placeholder="Add Section"
            {...register("sectionName", { required: true })}
            className="form-style w-full !bg-richblack-700"
          />
          {errors.sectionName && (
            <span className="text-xs ml-2 tracking-wide text-pink-200">
              Section name is required.
            </span>
          )}
        </div>

        {/* Create Section Button*/}
        <div className="flex mt-10 w-full items-baseline">
          <Iconbtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoIosAddCircleOutline className="text-yellow-50" size={24} />
          </Iconbtn>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              disabled={loading}
              className="ml-10 text-xs text-richblack-300 underline hover:text-yellow-50"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* render the  nested view component only when there is a section in the course*/}
      {course?.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-x-3">
        <button
          className="flex items-center bg-richblack-300 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900"
          onClick={goBack}
          disabled={loading}
        >
          <MdNavigateBefore />
          Back
        </button>
        <button
          className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900"
          onClick={goToNext}
          disabled={loading}
        >
          Next
          <MdNavigateNext />
        </button>
      </div>
    </div>
  );
};

export default CourseBuilderForm;
