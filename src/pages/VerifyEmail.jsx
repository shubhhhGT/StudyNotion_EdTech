import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../common/Spinner";
import OTPInput from "react-otp-input";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { sendOtp, signup } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

const VerifyEmail = () => {
  const { loading, signupData } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // On the first render, check if signup data is available or not, if not then navigate back to signup page
  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    dispatch(
      signup(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="font-semibold text-3xl leading-[2.375rem] text-richblack-5">
          <Spinner />
        </div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="font-semibold text-3xl leading-[2.375rem] text-richblack-5">
            Verify email
          </h1>
          <p className="my-4 leading-[1.625rem] text-richblack-100 text-[1.125rem]">
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={handleOnSubmit}>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span> </span>}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50 w-[48px] lg:w-[52px]"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-yellow-50 py-3 px-3 font-medium text-richblack-900"
            >
              Verify Email
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <div className=" justify-between">
              <Link to={"/signup"}>
                <p className="flex items-center gap-x-2 text-richblack-5">
                  <BiArrowBack /> Back to signup
                </p>
              </Link>
            </div>
            <button
              className="flex items-center text-blue-100 gap-x-2"
              onClick={() => dispatch(sendOtp(signupData.email, navigate))}
            >
              <RxCounterClockwiseClock />
              Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
