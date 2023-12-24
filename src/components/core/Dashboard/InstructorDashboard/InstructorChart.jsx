import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
  // State to keep track of current chart
  const [currChart, setCurrChart] = useState("students");

  // Function to generate random colours
  const generateRandomColors = (numOfColors) => {
    const colors = [];
    for (let i = 0; i < numOfColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`;
      colors.push(color);
    }
    return colors;
  };

  // Data for chart displaying students info
  const chartStudentsData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudents),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  };

  // Data for chart displaying income info
  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmount),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  };

  // Options
  const options = {
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col flex-1 gap-y-4 bg-richblack-800 rounded-md md:p-6 p-2">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      <div className="flex space-x-4 font-semibold">
        {/* Button to display student data */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        {/* Button to display income data */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>

      {/* Chart */}
      <div className=" mx-auto aspect-square h-[75%] w-[75%] md:h-[95%] md:w-[95%]">
        <Pie
          data={currChart === "students" ? chartStudentsData : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  );
};

export default InstructorChart;
