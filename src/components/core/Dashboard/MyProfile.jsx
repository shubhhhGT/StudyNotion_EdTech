import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Iconbtn from "../../../common/Iconbtn";
import { LuFileEdit } from "react-icons/lu";
import { useMediaQuery } from "react-responsive";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import Sidebar from "./Sidebar";

const MyProfile = () => {
  // Get the user from profile slice
  const { user } = useSelector((state) => state.profile);

  const navigate = useNavigate();

  // Media query to check if screen size is greater than 768px
  const isMediumScreenOrLarger = useMediaQuery({ minWidth: 768 });

  const [sidebarIconClicked, setSidebarIconClicked] = useState(false);

  return (
    <div>
      {/* Responsive design for small screen */}
      <div className="mb-4 md:hidden">
        {!isMediumScreenOrLarger &&
          (sidebarIconClicked ? (
            <div className="flex">
              <GoSidebarExpand
                size={24}
                fill="#AFB2BF"
                onClick={() => setSidebarIconClicked(!sidebarIconClicked)}
              />
              <Sidebar />
            </div>
          ) : (
            <GoSidebarCollapse
              size={24}
              fill="#AFB2BF"
              onClick={() => setSidebarIconClicked(!sidebarIconClicked)}
            />
          ))}
      </div>

      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        My Profile
      </h1>

      {/* Section 1 */}
      <div className="border border-richblack-700 bg-richblack-800 rounded-md flex md:flex-row flex-col items-center justify-between p-8 px-12">
        <div className="flex flex-col md:flex-row gap-x-4 items-center">
          <img
            src={`${user?.image}`}
            alt={`profile-${user?.firstName}`}
            className="w-[78px] aspect-square rounded-full object-cover "
          />

          <div
            className={`space-y-1 ${
              isMediumScreenOrLarger ? "" : "flex flex-col items-center"
            }`}
          >
            <p className="text-lg font-semibold text-richblack-5">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>

        <Iconbtn
          text={"Edit"}
          onclick={() => navigate("/dashboard/settings")}
          customClasses={`${isMediumScreenOrLarger ? "" : "mt-4"}`}
        >
          <LuFileEdit />
        </Iconbtn>
      </div>

      {/* Section 2 */}
      <div className="border my-10 gap-y-10 border-richblack-700 bg-richblack-800 rounded-md flex flex-col justify-between p-8 px-12">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <Iconbtn
            text={"Edit"}
            onclick={() => navigate("/dashboard/settings")}
          >
            <LuFileEdit />
          </Iconbtn>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-richblack-100"
              : "text-richblack-400"
          } text-sm font-medium`}
        >
          {user?.additionalDetails?.about ?? "Write something about yourself"}
        </p>
      </div>

      {/* Section 3 */}
      <div className="border my-10 gap-y-10 border-richblack-700 bg-richblack-800 rounded-md flex flex-col justify-between p-8 px-12">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">
            Personal Details
          </p>
          <Iconbtn
            text={"Edit"}
            onclick={() => navigate("/dashboard/settings")}
          >
            <LuFileEdit />
          </Iconbtn>
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-8 gap-x-48 max-w-[500px] justify-between">
          <div className="flex flex-col">
            <p className="mb-2 text-sm text-richblack-200">First Name</p>
            <p className="sm:text-sm text-xs font-medium text-richblack-5">
              {user?.firstName}
            </p>
          </div>
          <div className="flex flex-col ">
            <p className="mb-2 text-sm text-richblack-200">Last Name</p>
            <p
              className={`sm:text-sm text-xs font-medium ${
                user?.lastName ? "text-richblack-5" : "text-richblack-400"
              }`}
            >
              {user?.lastName ?? "Add last name"}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="mb-2 text-sm text-richblack-200">Email</p>
            <p className="sm:text-sm text-xs font-medium text-richblack-5">
              {user?.email}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="mb-2 text-sm text-richblack-200">Gender</p>
            <p
              className={`sm:text-sm text-xs font-medium ${
                user?.additionalDetails?.gender
                  ? "text-richblack-5"
                  : "text-richblack-400"
              }`}
            >
              {user?.additionalDetails?.gender ?? "Add gender"}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="mb-2 text-sm text-richblack-200">Phone Number</p>
            <p
              className={`sm:text-sm text-xs font-medium ${
                user?.additionalDetails?.contactNumber
                  ? "text-richblack-5"
                  : "text-richblack-400"
              }`}
            >
              {user?.additionalDetails?.contactNumber ?? "Add Contact number"}
            </p>
          </div>
          <div className="flex flex-col ">
            <p className="mb-2 text-sm text-richblack-200">Date of Birth</p>
            <p
              className={`sm:text-sm text-xs font-medium ${
                user?.additionalDetails?.dateOfBirth
                  ? "text-richblack-5"
                  : "text-richblack-400"
              }`}
            >
              {user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
