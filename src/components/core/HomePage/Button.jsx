import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, active, linkto }) => {
  return (
    <Link to={linkto} title={`${linkto.split("/")[1]} button`}>
      <div
        className={`text-center text-[13px] sm:text-[16px] px-6 py-3 rounded-md font-bold 
        ${
          active
            ? "bg-yellow-50 text-black"
            : "bg-richblack-800 shadow-[-2px_-2px_0px_0px_rgba(255,255,255,0.18)_inset]"
        } hover:scale-95 hover:shadow-none transition-all duration-200`}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button;
