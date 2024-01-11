import React from "react";
import { FooterLink2 } from "../data/footer-links";
import { Link } from "react-router-dom";

// Images
import Logo from "../assets/Logo/Logo-Full-Light.png";

// Icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];

const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code Challanges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];

const Plans = ["Paid Memberships", "For Students", "Business Solutions"];
const Community = ["Forums", "Chapters", "Events"];
const Company = ["About", "Careers", "Affiliates"];

const Footer = () => {
  return (
    <div className="bg-richblack-800">
      <div className="flex lg:flex-row flex-col w-11/12 gap-8 items-center justify-between max-w-maxContent text-richblack-300 leading-6 mx-auto relative py-14">
        <div className="border-b w-full flex flex-col lg:flex-row pb-5 border-richblack-700">
          {/* Section 1 */}
          <div className="lg:w-[50%] flex flex-row flex-wrap justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
            <div className="lg:w-[30%] flex flex-col gap-3 mb-7 lg:pl-0 ">
              <img src={Logo} alt="Logo" className="object-contain" />

              <h1 className="text-base text-richblack-50 font-semibold">
                Company
              </h1>

              <div className="flex flex-col gap-2">
                {Company.map((element, index) => {
                  return (
                    <div
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                      key={index}
                    >
                      <Link to={element.toLowerCase()}>{element}</Link>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 text-lg ">
                <FaFacebook className="hover:cursor-pointer hover:text-richblack-50" />
                <FaGoogle className="hover:cursor-pointer hover:text-richblack-50" />
                <FaTwitter className="hover:cursor-pointer hover:text-richblack-50" />
                <FaYoutube className="hover:cursor-pointer hover:text-richblack-50" />
              </div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h2 className="text-base text-richblack-50 font-semibold">
                Resources
              </h2>

              <div className="flex flex-col gap-2 mt-2">
                {Resources.map((element, index) => {
                  return (
                    <div
                      key={index}
                      className="text-sm cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={element.split(" ").join("-").toLowerCase()}>
                        {element}
                      </Link>
                    </div>
                  );
                })}
              </div>

              <h2 className="text-base text-richblack-50 font-semibold mt-7">
                Support
              </h2>

              <div className="text-sm cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                <Link to={"/help-center"}>Help Center</Link>
              </div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h2 className="text-base text-richblack-50 font-semibold">
                Plans
              </h2>

              <div className="flex flex-col gap-2 mt-2">
                {Plans.map((element, index) => {
                  return (
                    <div
                      key={index}
                      className="text-sm cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={element.split(" ").join("-").toLowerCase()}>
                        {element}
                      </Link>
                    </div>
                  );
                })}
              </div>

              <h2 className="text-base text-richblack-50 font-semibold mt-7">
                Community
              </h2>

              <div className="flex flex-col gap-2 mt-2">
                {Community.map((element, index) => {
                  return (
                    <div
                      key={index}
                      className="text-sm cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={element.split(" ").join("-").toLowerCase()}>
                        {element}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
            {FooterLink2.map((element, index) => {
              return (
                <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0" key={index}>
                  <h2 className="text-richblack-50 font-semibold text-[16px]">
                    {element.title}
                  </h2>

                  <div className="flex flex-col gap-2 mt-2">
                    {element.links.map((link, i) => {
                      return (
                        <div
                          className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                          key={i}
                        >
                          <Link to={link.link}>{link.title}</Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto  pb-14 text-sm">
        <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
          <div className="flex flex-row">
            {BottomFooter.map((ele, i) => {
              return (
                <div
                  className={`${
                    BottomFooter.length - 1 === i
                      ? ""
                      : "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  } px-3`}
                  key={i}
                >
                  <Link to={ele.split(" ").join("-").toLowerCase()}>{ele}</Link>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            Made with <span style={{ color: "red" }}>&#10084;&#65039;</span>{" "}
            CodeHelp © 2023 Studynotion
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
