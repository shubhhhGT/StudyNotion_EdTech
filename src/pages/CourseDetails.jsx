import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import RatingStars from "../common/RatingStars";
import GetAvgRating from "../utils/avgRating";
import Spinner from "../common/Spinner";
import { formatDate } from "../services/formatDate";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { BiInfoCircle } from "react-icons/bi";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import ComnfirmationModal from "../common/ComnfirmationModal";
import Markdown from "react-markdown";
import Error from "./Error";
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar";
import Footer from "../common/Footer";
import { ACCOUNT_TYPE } from "../utils/constants";
import toast from "react-hot-toast";
import { addTocart } from "../services/operations/cartAPI";
import { setTotalItems } from "../slices/cartSlice";
import ReviewSlider from "../common/ReviewSlideer";

const CourseDetails = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { loading } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState(null);
  let [totalNumberOfLectures, setTotalNumberOfLectures] = useState(0);
  const [isActive, setIsActive] = useState(Array(0));

  // Something extra start
  // Get cartItems
  // const [cartItem, setCartItem] = useState(null);
  // useEffect(() => {
  //   const fetchCartItems = async () => {
  //     const cartDetails = await getEntireCart(token);
  //     setCartItem(cartDetails);
  //     console.log("cartDetails", cartDetails);
  //   };
  //   fetchCartItems();
  //   // eslint-disable-next-line
  // }, [courseId]);
  // Something extra end

  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e !== id)
    );
  };

  const handleBuyCourse = async () => {
    if (token) {
      await buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  useEffect(() => {
    // Fetch the details of the corse to be shown
    const getCourseDetails = async () => {
      try {
        const res = await fetchCourseDetails(courseId);
        setCourseData(res);
      } catch (error) {
        console.log(error);
      }
    };

    // Call the function to get data
    getCourseDetails();
  }, [courseId]);

  // Avg review
  useEffect(() => {
    const count = GetAvgRating(
      courseData?.data?.courseDetails?.ratingAndReviews
    );
    setAvgReviewCount(count);
  }, [courseData]);

  // Total number of lectures
  useEffect(() => {
    let lectures = 0;
    courseData?.data?.courseDetails?.courseContent.forEach((sec) => {
      lectures += sec.subSection.length || 0;
    });
    setTotalNumberOfLectures(lectures);
  }, [courseData]);

  if (loading || !courseData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <Spinner />
      </div>
    );
  }
  if (!courseData.success) {
    return <Error />;
  }

  const handleAddToCart = async () => {
    // Check if the instructor is trying to buy a course
    // If so, show error
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are Instructor. You can't buy a course");
      return;
    }

    let courseID = JSON.parse(JSON.stringify({ _id: courseId }));
    // if the user is logged in then dispatch add to cart else asl to login first
    if (token) {
      const res = await addTocart({ courseId: courseID }, token);
      if (res) {
        dispatch(setTotalItems(totalItems + 1));
      }
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add courses to your cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEntrolled,
    createdAt,
    category,
  } = courseData?.data?.courseDetails;

  return (
    <>
      <div className="relative w-full bg-richblack-800">
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          <div className="mx-auto min-h-[450px]  py-8 lg:mx-0 lg:py-0 xl:max-w-[810px]">
            <div className="pb-7 lg:pb-0 pt-0 lg:pt-7 text-richblack-300 h-fit">
              Home / Learning /{" "}
              <span className="text-yellow-50">{`${category.name}`}</span>
            </div>

            {/* Image */}
            <div className="block lg:hidden relative max-h-[30rem]">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt={courseName}
                className="w-full aspect-square object-cover rounded-md max-h-[30rem] lg:max-h-[200px]"
              />
            </div>

            <div className=" flex flex-col items-center lg:items-start justify-center gap-4 text-lg text-richblack-5 py-5">
              {/* CourseName */}
              <p className="text-3xl font-bold text-richblack-5 sm:text-5xl">
                {courseName}
              </p>

              {/* Course Description */}
              <p className="text-richblack-200">{courseDescription}</p>

              {/* Ratings section */}
              <div className="flex text-md flex-wrap items-center gap-2">
                {/* Avg Review */}
                <span className="text-yellow-25">{avgReviewCount}</span>
                {/* Stars */}
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                {/* Total reviews */}
                <span>{`(${ratingAndReviews.length} reviews)`}</span>
                {/* Students enrolled */}
                <span>{`${studentsEntrolled.length} students enrolled`}</span>
              </div>

              {/* Intructor Name */}
              <p>
                Created By {`${instructor.firstName} ${instructor.lastName}`}
              </p>

              {/* Created At */}
              <div className="flex flex-wrap gap-5 text-lg">
                <div className="flex items-center gap-2">
                  <BiInfoCircle />
                  <p> Created at {formatDate(createdAt).split("|").at(0)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineGlobeAlt />
                  <p>English</p>
                </div>
              </div>
            </div>
            {/* checkout Buttons for small screen */}
            <div className="lg:hidden flex flex-col w-full gap-4 border-y border-y-richblack-500 py-4">
              <p className="text-3xl font-semibold text-richblack-5">
                Rs. {price}
              </p>
              <button
                onClick={
                  user && studentsEntrolled.includes(user._id)
                    ? () => navigate("/dashboard/enrolled-courses")
                    : handleBuyCourse
                }
                className="cursor-pointer w-full px-4 py-2 bg-yellow-50 hover:scale-105 rounded-md text-richblack-800"
              >
                {user && studentsEntrolled.includes(user._id)
                  ? "Go To Course"
                  : "Buy Now"}
              </button>
              {(!user || !studentsEntrolled.includes(user._id)) && (
                <button
                  onClick={handleAddToCart}
                  className="cursor-pointer w-full px-4 py-2 bg-richblack-800 hover:scale-105 rounded-md text-richblack-5 hover:text-yellow-50"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>

          {/* vertical line */}
          {/* <div className=" hidden xl:block h-[1px] rotate-90 w-[300px] absolute ml-[calc(100vw-70%)] top-52 bg-richblack-600"></div> */}

          {/* Card Section, Buy Now, Add to cart */}
          <div className="hidden lg:block absolute mx-auto min-h-[600px] w-1/3 max-w-[410px] top-[60px] right-[1rem] ">
            <CourseDetailsCard
              course={courseData?.data?.courseDetails}
              handleBuyCourse={handleBuyCourse}
              setConfirmationModal={setConfirmationModal}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto box-content px-4 lg:w-[1260px] text-start text-richblack-5">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What you will learn */}
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <div className="mt-5">
              <Markdown>{whatYouWillLearn}</Markdown>
            </div>
          </div>

          {/* Course Content Section */}
          <div className="max-w-[830px]">
            <div className="flex flex-col gap-3">
              <p className="text-3xl font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2 text-richblack-100">
                  <span>
                    {courseContent.length} {`section(s)`}
                  </span>
                  <span>
                    {totalNumberOfLectures} {`lecture(s)`}{" "}
                  </span>
                  <span>
                    {courseData?.data?.totalDuration} {`total length`}{" "}
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => setIsActive([])}
                    className="text-yellow-25"
                  >
                    Collapse all sections
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Course Details accordion */}
          <div className="py-4">
            {courseContent.map((course, index) => (
              <CourseAccordionBar
                course={course}
                key={index}
                isActive={isActive}
                handleActive={handleActive}
              />
            ))}
          </div>

          {/* Author Details */}
          <div className="flex flex-col mb-12 py-4">
            <p className="text-3xl font-semibold">Author</p>
            <div className="flex gap-4 items-center py-4">
              <img
                alt="Author"
                className="h-14 w-14 rounded-full object-cover"
                src={
                  instructor.image
                    ? instructor.image
                    : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                }
              />
              <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
            </div>
            <p className="text-richblack-50">
              {instructor?.additionalDetails?.about}
            </p>
          </div>
        </div>
      </div>

      <section className="w-11/12 mx-auto my-20 max-w-maxContent flex-col flex items-center justify-between gap-8 bg-richblack-900 text-white">
        <div className="text-center text-4xl font-semibold mt-10">
          Reviews from other learners
        </div>
        <ReviewSlider />
      </section>

      <Footer />
      {/* <button
        className="bg-yellow-50 px-6 py-4"
        onClick={() => handleBuyCourse()}
      >
        Buy Now
      </button> */}

      {confirmationModal && (
        <ComnfirmationModal modalData={confirmationModal} />
      )}
    </>
  );
};

export default CourseDetails;
