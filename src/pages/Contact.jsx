import React from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { PiGlobeHemisphereWestDuotone } from "react-icons/pi";
import { IoIosCall } from "react-icons/io";
import ContactUsForm from "../common/ContactUsForm";
import Footer from "../common/Footer";
import ReviewSlider from "../common/ReviewSlideer";

const Contact = () => {
  return (
    <div>
      {/* Section 1 */}
      <section className="flex flex-col lg:flex-row w-11/12 mx-auto justify-between gap-10 text-white mt-20 max-w-maxContent">
        {/* Left part */}
        <div className="lg:w-[40%] flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6 h-fit">
          <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
            <div className="flex flex-row items-center gap-3">
              <HiChatBubbleLeftRight size={25} />
              <p className="text-lg font-semibold text-richblack-5">
                Chat on us
              </p>
            </div>
            <div className="font-medium">
              Our friendly team is here to help.
            </div>
            <div className="font-semibold">info@studynotion.com</div>
          </div>

          <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
            <div className="flex flex-row items-center gap-3">
              <PiGlobeHemisphereWestDuotone size={25} />
              <p className="text-lg font-semibold text-richblack-5">Visit us</p>
            </div>
            <div className="font-medium">
              Come and say hello at our office HQ.
            </div>
            <div className="font-semibold">
              Akshya Nagar 1st Block 1st Cross, Rammurthy nagar,
              Bangalore-560016
            </div>
          </div>

          <div className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
            <div className="flex flex-row items-center gap-3">
              <IoIosCall size={25} />
              <p className="text-lg font-semibold text-richblack-5">Call us</p>
            </div>
            <div className="font-medium">Mon - Fri From 8am to 5pm</div>
            <div className="font-semibold">+123 456 7869</div>
          </div>
        </div>

        {/* Right part */}
        <div className="lg:w-[60%] border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 flex gap-3 flex-col">
          <h1 className="text-4xl leading-10 font-semibold text-richblack-5">
            Got a Idea? We've got the skills. Let's team up
          </h1>
          <p className="mb-10">
            Tell us more about yourself and what you're got in mind.
          </p>
          <ContactUsForm />
        </div>
      </section>

      {/* Review slider */}
      <section className="w-11/12 mx-auto my-20 max-w-maxContent flex-col flex items-center justify-between gap-8 bg-richblack-900 text-white">
        <div className="text-center text-4xl font-semibold mt-10">
          Reviews from other learners
        </div>
        <ReviewSlider />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
