import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProfile } from "../../../services/operations/SettingsAPI";
import { useMediaQuery } from "react-responsive";

const DeleteProfile = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMediumScreenOrLarger = useMediaQuery({ minWidth: 640 });

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteProfile(token, navigate));
    } catch (error) {
      console.log("Error Message- ", error.message);
    }
  };

  return (
    <div
      className={`my-10 flex flex-col sm:flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-4 sm:px-12 ${
        isMediumScreenOrLarger ? "" : "items-center"
      }`}
    >
      <div
        className={`flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700 `}
      >
        <FiTrash2 className="text-3xl text-pink-200" />
      </div>

      <div
        className={`flex flex-col space-y-2 ${
          isMediumScreenOrLarger ? "" : "items-center"
        }`}
      >
        <h2 className="text-lg font-semibold text-richblack-5">
          Delete Account
        </h2>
        <div
          className={`md:w-3/5 text-pink-25 ${
            isMediumScreenOrLarger
              ? ""
              : "flex flex-col w-full text-center items-center"
          }`}
        >
          <p>Would you like to delete account?</p>
          <p>
            This account may contain Paid Courses. Deleting your account is
            permanent and will remove all the content associated with it.
          </p>
        </div>
        <button
          type="button"
          className="w-fit text-pink-300 italic cursor-pointer"
          onClick={handleDeleteAccount}
        >
          I want to delete my account.
        </button>
      </div>
    </div>
  );
};

export default DeleteProfile;
