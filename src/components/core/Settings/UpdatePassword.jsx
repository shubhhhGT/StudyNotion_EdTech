import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Iconbtn from "../../../common/Iconbtn";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../services/operations/SettingsAPI";

const UpdatePassword = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const submitUpdatePasswordForm = async (formData) => {
    console.log(formData);
    console.log("Form Submitted with data");
    try {
      await changePassword(token, formData);
    } catch (error) {
      console.log("Error Message- ", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitUpdatePasswordForm)}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-2 sm:px-12">
        <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Current Password */}
          <div className="flex flex-col relative gap-2 lg:w-[48%]">
            <label
              htmlFor="oldPassword"
              className="text-sm text-richblack-5 mb-2"
            >
              Current Password
            </label>
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter Current Password"
              className="!bg-richblack-700 form-style"
              {...register("oldPassword", { required: true })}
            />
            <span
              className="absolute right-4 top-12"
              onClick={() => setShowOldPassword((prev) => !prev)}
            >
              {showOldPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            {errors.oldPassword && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your current password
              </span>
            )}
          </div>

          {/* New Password */}
          <div className="flex flex-col relative gap-2 lg:w-[48%]">
            <label
              htmlFor="newPassword"
              className="text-sm text-richblack-5 mb-2"
            >
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              placeholder="Enter New Password"
              className="!bg-richblack-700 form-style"
              {...register("newPassword", { required: true })}
            />
            <span
              className="absolute right-4 top-12"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            {errors.newPassword && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your new password
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-x-2 justify-end">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
        >
          Cancel
        </button>
        <Iconbtn text={"Update"} type="submit" />
      </div>
    </form>
  );
};

export default UpdatePassword;
