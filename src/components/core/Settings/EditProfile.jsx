import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Iconbtn from "../../../common/Iconbtn";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../../services/operations/SettingsAPI";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

const EditProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitProfileForm = async (data) => {
    console.log(data);
    try {
      dispatch(updateProfile(token, data));
    } catch (error) {
      console.log("Error Message...", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitProfileForm)}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-2 sm:px-12">
        <h2 className="text-lg font-semibold text-richblack-5">
          Profile Information
        </h2>

        <div className="grid sm:grid-cols-2 grid-cols-1 gap-8 justify-between">
          {/* First Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="firstName"
              className="text-sm text-richblack-5 mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter First Name"
              className=" !bg-richblack-700 form-style"
              {...register("firstName", { required: true })}
              defaultValue={user?.firstName}
            />
            {errors.firstName && (
              <span className="-mt-1 text-xs text-yellow-100">
                Please enter your first name.
              </span>
            )}
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-sm text-richblack-5 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter Last Name"
              className=" !bg-richblack-700 form-style"
              {...register("lastName", { required: true })}
              defaultValue={user?.lastName}
            />
            {errors.lastName && (
              <span className="-mt-1 text-xs text-yellow-100">
                Please enter your last name.
              </span>
            )}
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="dateOfBirth"
              className="text-sm text-richblack-5 mb-2"
            >
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              placeholder="Enter Date of Birth"
              className=" !bg-richblack-700 form-style"
              {...register("dateOfBirth", {
                required: {
                  value: true,
                  message: "Please Enter your Date of Birth.",
                },
                max: {
                  value: new Date().toISOString().split("T")[0],
                  message: "Date of Birth cannot be in future.",
                },
              })}
              defaultValue={user?.additionalDetails?.dateOfBirth}
            />
            {errors.dateOfBirth && (
              <span className="-mt-1 text-xs text-yellow-100">
                Please enter your Date of Birth.
              </span>
            )}
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-2">
            <label htmlFor="gender" className="text-sm text-richblack-5 mb-2">
              Gender
            </label>
            <select
              type="text"
              name="gender"
              id="gender"
              className=" !bg-richblack-700 form-style"
              {...register("gender", { required: true })}
              defaultValue={user?.additionalDetails?.gender}
            >
              {genders.map((e, i) => {
                return (
                  <option key={i} value={e}>
                    {e}
                  </option>
                );
              })}
            </select>
            {errors.gender && (
              <span className="-mt-1 text-xs text-yellow-100">
                Please enter your gender.
              </span>
            )}
          </div>

          {/* Contact Number */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contactNumber"
              className="text-sm text-richblack-5 mb-2"
            >
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              id="contactNumber"
              placeholder="Enter Contact Number"
              className=" !bg-richblack-700 form-style"
              {...register("contactNumber", {
                required: {
                  value: true,
                  message: "Please enter your contact number.",
                },
                maxLength: { value: 12, message: "Invalid Contact Number" },
                minLength: { value: 10, message: "Invalid Contact Number" },
              })}
              defaultValue={user?.additionalDetails?.contactNumber}
            />
            {errors.contactNumber && (
              <span className="-mt-1 text-xs text-yellow-100">
                {errors.contactNumber.message}
              </span>
            )}
          </div>

          {/* About */}
          <div className="flex flex-col gap-2">
            <label htmlFor="about" className="text-sm text-richblack-5 mb-2">
              About
            </label>
            <input
              type="text"
              name="about"
              id="about"
              placeholder="Enter Bio Details"
              className=" !bg-richblack-700 form-style"
              {...register("about", { required: { value: true } })}
              defaultValue={user?.additionalDetails?.about}
            />
            {errors.about && (
              <span className="-mt-1 text-xs text-yellow-100">
                Please enter about
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            navigate("/dashboard/my-profile");
          }}
          className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
        >
          Cancel
        </button>
        <Iconbtn type="submit" text={"Save"} />
      </div>
    </form>
  );
};

export default EditProfile;
