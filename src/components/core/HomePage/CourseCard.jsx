import React from "react";
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ({ cardData, selectedCard, setSelectedCard }) => {
  return (
    <div
      className={`w-[340px] lg:w-[30%] 
    ${
      selectedCard === cardData?.heading
        ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50"
        : "bg-richblack-800"
    } text-richblack-25 h-[300px] box-border cursor-pointer`}
      onClick={() => setSelectedCard(cardData?.heading)}
    >
      <div className="flex flex-col gap-3 border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 ">
        {/* Heading */}
        <div
          className={`${
            selectedCard === cardData?.heading && "text-richblack-800"
          } font-semibold text-[20px]`}
        >
          {cardData?.heading}
        </div>
        {/* Sub heading */}
        <div className="text-richblack-200">{cardData?.description}</div>
      </div>

      <div
        className={`flex justify-between ${
          selectedCard === cardData?.heading
            ? "text-blue-300"
            : "text-richblack-300"
        } px-6 py-3 font-medium`}
      >
        {/* Level */}
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <p>{cardData?.level}</p>
        </div>

        {/* FlowChart */}
        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <p>{cardData?.lessionNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
