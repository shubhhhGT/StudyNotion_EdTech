import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";
import maskEmail from "../utils/maskEmail";
import { passUpdateEmail } from "../services/operations/authAPI";

const ResetComplete = ({ email }) => {
  const { loading } = useSelector((state) => state.auth);
  console.log(email);

  const dispatch = useDispatch();

  // const handleOnClick = (e) => {
  //     dispatch(passUpdateEmail(email));
  // }

  useEffect(() => {
    dispatch(passUpdateEmail(email));
  });

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="font-semibold text-3xl leading-[2.375rem] text-richblack-5">
          <Spinner />
        </div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="font-semibold text-3xl leading-[2.375rem] text-richblack-5">
            Reset complete
          </h1>
          <p className="my-4 leading-[1.625rem] text-richblack-100 text-[1.125rem]">
            {`All done! We have sent an email to ${maskEmail({
              email,
            })} to confirm`}
          </p>
          <Link to={"/login"}>
            <button className="mt-6 w-full rounded-lg bg-yellow-50 py-3 px-3 font-medium text-richblack-900">
              Return to login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResetComplete;
