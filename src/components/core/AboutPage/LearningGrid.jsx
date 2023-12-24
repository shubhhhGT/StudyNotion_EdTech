import React from "react";
import HighlightText from "../HomePage/HighlightText";
import Button from "../HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "World-Class Learning for",
    highlightText: "Anyone, Anywhere",
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
    BtnText: "Learn More",
    BtnLink: "/signup",
  },
  {
    order: 1,
    heading: "Curriculum Based on Industry Needs",
    description:
      "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
  },
  {
    order: 2,
    heading: "Our Learning Methods",
    description:
      "Discover our diverse and innovative learning methods at Studynotion. We collaborate with over 275+ esteemed universities and companies to bring cutting-edge approaches that enhance your learning experience.",
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "Elevate your career with our industry-recognized certifications. The Belajar curriculum is meticulously designed to provide you with the knowledge and skills that employers seek, saving you time and ensuring your success.",
  },
  {
    order: 4,
    heading: `Rating "Auto-grading"`,
    description:
      "Experience the future of education with our advanced auto-grading system. The Belajar curriculum is not only cost-effective but also ensures a seamless learning process, allowing you to focus on what matters most— your education.",
  },
  {
    order: 5,
    heading: "Ready to Work",
    description:
      "Gain a competitive edge in the job market. The Belajar curriculum is tailored to make learning easier and aligns with industry needs, ensuring you are well-prepared for the workforce. Start your journey to success with us!",
  },
];

const LearningGrid = () => {
  return (
    <div className="grid mx-auto grid-cols-1 xl:grid-cols-4 mb-12 w-[350px] xl:w-fit">
      {LearningGridArray.map((card, index) => {
        return (
          <div
            key={index}
            className={`${index === 0 && "xl:col-span-2 xl:h-[294px]"} 
                ${
                  card.order % 2 === 1
                    ? "bg-richblack-700 h-[294px]"
                    : card.order % 2 === 0
                    ? "bg-richblack-800 h-[294px]"
                    : "bg-transparent"
                }
                ${card.order === 3 && "xl:col-start-2"}`}
          >
            {card.order === -1 ? (
              <div className="flex flex-col xl:w-[90%] gap-3 pb-10 xl:pb-0">
                <h2 className="text-4xl font-semibold">
                  {card.heading}
                  <span>
                    <HighlightText text={card.highlightText} />
                  </span>
                </h2>
                <p className="font-medium text-richblack-300">
                  {card.description}
                </p>
                <div className="w-fit mt-2">
                  <Button
                    active={true}
                    children={card.BtnText}
                    linkto={card.BtnLink}
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-8">
                <h3 className="text-lg text-richblack-5">{card.heading}</h3>
                <p className="font-medium text-richblack-300">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
