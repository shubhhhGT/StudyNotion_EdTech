import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import CourseInformationForm from "./CourseInformation/CourseInformationForm";
import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm";
import { PublishCourse } from "./PublishCourse";

const RenderSteps = () => {
  const { step } = useSelector((state) => state.course);

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ];

  return (
    <>
      <div className="mb-2 relative flex w-full justify-center">
        {steps.map((item) => (
          <React.Fragment key={item.id}>
            <div>
              {/* Step Number */}
              <div
                className={`grid aspect-square w-[34px] place-items-center rounded-full border ${
                  step === item.id
                    ? "bg-yellow-900 border-yellow-50 text-yellow-50"
                    : "border-richblack-700 bg-richblack-800 text-richblack-300"
                } ${step > item.id && "bg-yellow-50 text-yellow-50"}`}
              >
                {step > item.id ? (
                  <FaCheck className="font-bold text-richblack-900" />
                ) : (
                  item.id
                )}
              </div>
            </div>

            {/* Dash */}
            {item.id !== steps.length && (
              <>
                <div
                  className={`h-[calc(34px/2)] w-[33%] border-b-2 border-dashed ${
                    step > item.id ? "border-yellow-50" : "border-richblack-500"
                  }`}
                ></div>
              </>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex w-full relative mb-16 select-none justify-between">
        {steps.map((item) => (
          <React.Fragment key={item.id}>
            <div className="sm:min-w-[130px] min-w-[100px] flex flex-col items-center sm:gap-y-2">
              <p
                className={`text-sm ${
                  step >= item.id ? "text-richblack-5" : "text-richblack-500"
                }`}
              >
                {item.title}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>

      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </>
  );
};

export default RenderSteps;
