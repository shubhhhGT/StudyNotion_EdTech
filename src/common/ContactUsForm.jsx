import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CountryCode from "../data/countrycode.json";
import { contactUs } from "../services/operations/contactAPI";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    await contactUs(data, setLoading)();
    // console.log("MAIL SENT");
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      onSubmit={handleSubmit(submitContactForm)}
      className="flex flex-col gap-7"
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* First Name */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label>
            <p className="text-sm text-richblack-5 mb-2">First Name</p>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter first name"
              className="form-style"
              {...register("firstName", { required: true })}
            />
          </label>
          {errors.firstName && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your name
            </span>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label>
            <p className="text-sm text-richblack-5 mb-2">Last Name</p>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter last name"
              className="form-style"
              {...register("lastName")}
            />
          </label>
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label>
          <p className="text-sm text-richblack-5 mb-2">Email Address</p>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter email address"
            className="form-style w-full"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your email
            </span>
          )}
        </label>
      </div>

      {/* Phone number */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phoneNo">
          <p className="text-sm text-richblack-5 mb-2">Phone Number</p>
          <div className="flex gap-5">
            {/* Dropdown */}
            <div className="w-[84px] flex flex-col gap-2">
              <select
                name="dropdown"
                id="dropdown"
                defaultValue={"+91 - India"}
                {...register("countrycode", { required: true })}
                className="form-style"
              >
                {/* Default option */}
                <option value={"+91 - India"}>+91 - India</option>

                {/* Other options */}
                {CountryCode.map((element, index) => {
                  if (
                    `${element.code} - ${element.country}` === "+91 - India"
                  ) {
                    return null;
                  }
                  return (
                    <option
                      key={index}
                      value={`${element.code} - ${element.country}`}
                    >
                      {element.code} - {element.country}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex w-[calc(100%-90px)] flex-col gap-2">
              <input
                type="number"
                name="phoneNo"
                id="phoneNo"
                placeholder="12345 67890"
                className="form-style"
                {...register("phoneNo", {
                  required: true,
                  maxLength: { value: 10, message: "Invalid Phone Number" },
                  minLength: { value: 8, message: "Invalid phone number" },
                })}
              />
            </div>
          </div>
        </label>
        {errors.phoneNo && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            {errors.phoneNo.message}
          </span>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label>
          <p className="text-sm text-richblack-5 mb-2">Message</p>
          <textarea
            type="text"
            name="message"
            id="message"
            cols={30}
            rows={7}
            placeholder="Enter your message here"
            className="form-style w-full"
            {...register("message", {
              required: true,
              validate: (value) => {
                // Trim whitespace and check if the message is not empty
                return value.trim().length > 0 || "Please enter your message";
              },
            })}
          />
          {errors.message && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your message
            </span>
          )}
        </label>
      </div>

      {/* Button */}
      <button
        disabled={loading}
        type="submit"
        className={`text-center text-[13px] sm:text-[16px] px-6 py-3 rounded-md font-bold bg-yellow-50 text-black hover:scale-95 hover:shadow-none transition-all duration-200 ${
          loading ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactUsForm;
