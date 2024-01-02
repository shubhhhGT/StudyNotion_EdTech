import React, { useEffect } from "react";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../services/operations/authAPI";
import { FcGoogle } from "react-icons/fc";
import { setToken } from "../../../slices/authSlice";
import { setUser } from "../../../slices/profileSlice";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const [showPassword, setShowPassword] = useState(false);

  const changeHandler = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(login(formData.email, formData.password, navigate));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Wait for a short time before checking the URL
        // This allows the server to redirect and include data in the URL

        // Parse the URL to extract data
        const urlParams = new URLSearchParams(window.location.search);
        const googleLogin = urlParams.get("googleLogin");
        const token = urlParams.get("token");
        var user = urlParams.get("user");
        user = JSON.parse(user);

        if (token && user) {
          dispatch(setToken(token));
          dispatch(setUser(user));

          // Set the item in local storage
          localStorage.setItem("token", JSON.stringify(token));
          localStorage.setItem("user", JSON.stringify(user));

          // Remove the parameters from the URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          // Redirect to the user profile page
          navigate("/dashboard/my-profile");
        }
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    };

    fetchData();
  }, [dispatch, navigate]);

  const handleLoginWithGoogle = async () => {
    try {
      // Open a new window for Google authentication
      window.open(
        "https://studynotion-backend-h3qn.onrender.com/auth/google",
        "_self"
      );
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <>
      <form
        className="mt-6 flex w-full flex-col gap-y-4"
        onSubmit={submitHandler}
      >
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter email address"
            onChange={changeHandler}
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full form-style"
          />
        </label>

        <label className="w-full relative">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Password <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            placeholder="Enter Password"
            onChange={changeHandler}
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
          <span
            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
          <Link to={"/forgot-password"}>
            <p className="mt-1 text-xs ml-auto max-w-max text-blue-200">
              Forgot Password
            </p>
          </Link>
        </label>
        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 w-full">
        <div className="flex w-full items-center justify-between">
          <div className="w-[42%] h-[1px] bg-richblack-700"></div>
          <div className="text-center text-richblack-600 text-sm">OR</div>
          <div className="w-[42%] h-[1px] bg-richblack-700"></div>
        </div>
        <button
          onClick={handleLoginWithGoogle}
          className="border mt-4 border-richblack-600 px-4 py-3 rounded-md text-richblack-5 flex items-center gap-x-2 w-full justify-center text-lg hover:bg-richblack-700"
        >
          Sign in with Google <FcGoogle size={24} />
        </button>
      </div>
    </>
  );
};

export default LoginForm;
