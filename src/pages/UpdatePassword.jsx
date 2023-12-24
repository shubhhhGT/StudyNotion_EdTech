import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../common/Spinner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { resetPassword, getUser } from "../services/operations/authAPI";
import Checkbox from "../components/core/ResetPass/Checkbox";
import ResetComplete from "./ResetComplete";

const UpdatePassword = () => {
  const { loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const location = useLocation();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { password, confirmPassword } = formData;
  const [passResetComplete, setPassResetComplete] = useState(false);
  const [email, setEmail] = useState("");

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const resetPasswordToken = location.pathname.split("/").at(-1);
    dispatch(
      resetPassword(
        password,
        confirmPassword,
        resetPasswordToken,
        setPassResetComplete
      )
    );
    dispatch(getUser(resetPasswordToken)).then((userEmail) => {
      console.log("User email:", userEmail);
      setEmail(userEmail);
    });
  };

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="font-semibold text-3xl leading-[2.375rem] text-richblack-5">
          <Spinner />
        </div>
      ) : !passResetComplete ? (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="font-semibold text-3xl leading-[2.375rem] text-richblack-5">
            Choose new password
          </h1>
          <p className="my-4 leading-[1.625rem] text-richblack-100 text-[1.125rem]">
            Almost done. Enter your new password and youre all set.
          </p>
          <form onSubmit={handleOnSubmit}>
            <label className="relative">
              <p className="mb-1 text-sm text-richblack-5">
                New password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                name="password"
                value={formData.password}
                type={showPassword ? "text" : "password"}
                placeholder="password"
                onChange={handleOnChange}
                className="form-style w-full"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute text-richblack-200 top-[34px] right-3 cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} />
                ) : (
                  <AiOutlineEye fontSize={24} />
                )}
              </span>
            </label>

            <label className="relative">
              <p className="mb-1 mt-5 text-sm text-richblack-5">
                Confirm new password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="confirm password"
                onChange={handleOnChange}
                className="form-style w-full"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute text-richblack-200 top-[90px] right-3 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} />
                ) : (
                  <AiOutlineEye fontSize={24} />
                )}
              </span>
            </label>

            <Checkbox password={password} />

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-yellow-50 py-3 px-3 font-medium text-richblack-900"
            >
              Reset Password
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <Link to={"/login"}>
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack /> Back to login
              </p>
            </Link>
          </div>
        </div>
      ) : (
        <ResetComplete email={email} />
      )}
    </div>
  );
};

export default UpdatePassword;
