import React, { useEffect, useRef, useState } from "react";
import Logo from "../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../data/navbar-links";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropdown from "../components/core/Auth/ProfileDropdown";
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/apis";
import { SlArrowDown } from "react-icons/sl";
import { AiOutlineMenu } from "react-icons/ai";
import { HiOutlineHome, HiUserGroup } from "react-icons/hi";
import { IoIosArrowBack, IoIosCall } from "react-icons/io";
import { IoLogInOutline } from "react-icons/io5";
import { ImUserPlus } from "react-icons/im";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { ACCOUNT_TYPE } from "../utils/constants";
import { getEntireCart } from "../services/operations/cartAPI";
import { setTotalItems } from "../slices/cartSlice";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);

  const ref = useRef(null);

  // Using onClickOutside to handle state changes for clicking outside
  useOnClickOutside(ref, () => setIsNavbarCollapsed(true));

  // const toggleNavabr = () => {
  //   setIsNavbarCollapsed(!isNavbarCollapsed);
  // };

  // exrea
  const [cart, setCart] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR) {
      const getCartDetails = async () => {
        setLoading(true);
        try {
          const cartData = await getEntireCart(token);
          setCart(cartData);
          dispatch(setTotalItems(cartData?.data?.data?.totalItems));
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      };

      getCartDetails();
    }
    // eslint-disable-next-line
  }, [user, token]);

  // ends

  const fetchSublinks = async () => {
    setLoading(true);
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setSubLinks(result.data.allCategories);
    } catch (error) {
      console.log("could not fetch the category list");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSublinks();
  }, []);

  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] bg-richblack-800 border-b-richblack-700">
      <div
        className={`flex w-11/12 max-w-maxContent justify-between items-center ${
          isNavbarCollapsed ? "" : "relative"
        }`}
      >
        {/* Logo */}
        <Link to={"/"}>
          <img src={Logo} alt="Logo" width={160} height={32} />
        </Link>

        {/* Navlinks for medium and large screens */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((ele, i) => {
              return (
                <li key={i}>
                  {ele.title === "Catalog" ? (
                    <div className="relative flex items-center gap-2 group ">
                      <p className="group-hover:cursor-pointer">{ele?.title}</p>
                      <SlArrowDown className="text-sm group-hover:cursor-pointer" />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5 "></div>
                        {loading ? (
                          <div className="text-center">Loading... </div>
                        ) : subLinks.length ? (
                          subLinks.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              key={i}
                              className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                            >
                              <p>{subLink.name}</p>
                            </Link>
                          ))
                        ) : (
                          <div className="text-center">No Courses Found</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={ele?.path}>
                      <p
                        className={
                          matchRoute(ele?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }
                      >
                        {ele?.title}
                      </p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Login/signup/ dashboard buttons */}
        <div className="flex gap-x-4 items-center">
          {user && user?.accountType !== "Instructor" && (
            <Link to={"/dashboard/cart"} className="relative">
              <AiOutlineShoppingCart className="hidden md:block text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="hidden md:grid absolute -bottom-2 -right-2 h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to={"/login"}>
              <button className="hidden md:block border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to={"/signup"}>
              <button className="hidden md:block border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
          {/* Hamburger for small screens */}
          <button
            name="Menu"
            className="mr-4 md:hidden"
            onClick={() => setIsNavbarCollapsed(!isNavbarCollapsed)}
          >
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
          </button>
        </div>

        {/* Collapsible menu for small screens */}
        <div
          ref={ref}
          className={`md:hidden ${
            isNavbarCollapsed
              ? "hidden"
              : "block text-white absolute z-50 top-8 bg-richblack-700 right-0"
          }`}
        >
          <div className="absolute -top-1 w-4 h-4 bg-richblack-700 rotate-45 right-6 translate-x-[45%]"></div>
          <ul className="flex justify-center px-4 flex-col gap-x-6 text-richblack-25 border rounded-md border-richblack-500">
            {NavbarLinks.map((ele, i) => {
              return (
                <li key={i} className="group">
                  {ele.title === "Catalog" ? (
                    <div className="relative gap-x-2 flex items-center group mb-2 ">
                      <IoIosArrowBack className="group-hover:cursor-pointer" />
                      <p className="group-hover:cursor-pointer">{ele.title}</p>
                      <div className="invisible absolute -left-[60%] -top-[130%] z-[1000] flex w-[200px] translate-x-[-70%] -translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute  right-[7%] top-[7%] -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5 "></div>
                        {loading ? (
                          <div className="text-center">Loading...</div>
                        ) : subLinks.length ? (
                          subLinks.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              key={i}
                              className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                            >
                              <p onClick={() => setIsNavbarCollapsed(true)}>
                                {subLink.name}
                              </p>
                            </Link>
                          ))
                        ) : (
                          <div className="text-center">No Courses Found</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={ele.path}>
                      <div
                        className={`flex mb-2 gap-x-2 items-center group-hover:text-yellow-50`}
                      >
                        <span>
                          {ele.title === "Home" && <HiOutlineHome />}
                          {ele.title === "Catalog" && <IoIosArrowBack />}
                          {ele.title === "About Us" && <HiUserGroup />}
                          {ele.title === "Contact Us" && <IoIosCall />}
                        </span>
                        <p onClick={() => setIsNavbarCollapsed(true)}>
                          {ele.title}
                        </p>
                      </div>
                    </Link>
                  )}
                </li>
              );
            })}
            <div className="mt-1 flex flex-col border-t border-t-richblack-500">
              {token === null && (
                <Link to={"/login"}>
                  <button
                    onClick={() => setIsNavbarCollapsed(true)}
                    className="border w-full flex gap-x-2 items-center border-richblack-700 bg-richblack-800 px-[12px] py-[8px] mt-2 text-richblack-100 rounded-md"
                  >
                    <IoLogInOutline />
                    Log in
                  </button>
                </Link>
              )}
              {token === null && (
                <Link to={"/signup"}>
                  <button
                    onClick={() => setIsNavbarCollapsed(true)}
                    className="border w-full flex gap-x-2 items-center border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md"
                  >
                    <ImUserPlus />
                    Sign up
                  </button>
                </Link>
              )}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
