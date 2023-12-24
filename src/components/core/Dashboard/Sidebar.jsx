import React, { useState } from "react";
import { sidebarLinks } from "../../../data/dashboard-links";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../common/Spinner";
import SidebarLink from "./SidebarLink";
import { VscSignOut } from "react-icons/vsc";
import ComnfirmationModal from "../../../common/ComnfirmationModal";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../services/operations/authAPI";
import { useMediaQuery } from "react-responsive";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState(null);

  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const { loading: authLoading } = useSelector((state) => state.auth);

  const isMediumScreenOrLarger = useMediaQuery({ minWidth: 768 });

  if (authLoading || profileLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 ${
          isMediumScreenOrLarger
            ? "h-[calc(100vh-3.5rem)] min-w-[220px] py-10"
            : "min-w-[200px] py-6 rounded-md transition-all ease-in-out duration-1000"
        }`}
      >
        {/* Top Part of sidebar */}
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            );
          })}
        </div>

        {/* Horizontal Line */}
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700"></div>

        {/* Bottom Part of Sidebar */}
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName={"VscSettingsGear"}
          />

          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-8 py-2 text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
      {confirmationModal && (
        <ComnfirmationModal modalData={confirmationModal} />
      )}
    </>
  );
};

export default Sidebar;
