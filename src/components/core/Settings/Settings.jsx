import React, { useState } from "react";
import ChangeProfilePic from "./ChangeProfilePic";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";
import DeleteProfile from "./DeleteProfile";
import { useMediaQuery } from "react-responsive";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import Sidebar from "../../core/Dashboard/Sidebar";

const Settings = () => {
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
        Edit Profile
      </h1>
      {/* Component to change the profile pic */}
      <ChangeProfilePic />
      {/* Component to update the profile */}
      <EditProfile />
      {/* Component to chnage password */}
      <UpdatePassword />
      {/* Component to delete profile */}
      <DeleteProfile />
    </div>
  );
};

export default Settings;
