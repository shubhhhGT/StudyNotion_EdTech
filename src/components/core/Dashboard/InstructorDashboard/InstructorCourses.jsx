import React, { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { formatDate } from "../../../../services/formatDate";
import { COURSE_STATUS } from "../../../../utils/constants";
import { HiClock } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import ComnfirmationModal from "../../../../common/ComnfirmationModal";
import { useMediaQuery } from "react-responsive";

const InstructorCourses = ({ courses, setCourses }) => {
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState(null);

  const isSmallScreenOrLarger = useMediaQuery({ minWidth: 640 });

  const handleDeleteCourse = async (courseId) => {
    setLoading(true);
    // Delete the course using course ID
    await deleteCourse({ courseId: courseId }, token);
    // get the remaining courses after deleting a course
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  console.log("Getting courses for total time:", courses);

  return (
    <>
      {isSmallScreenOrLarger ? (
        <Table className="border border-richblack-700 rounded-xl">
          <Thead>
            <Tr className="flex gap-x-10 border-b border-richblack-700 px-6 py-2 rounded-t-md">
              <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
                Courses
              </Th>
              <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                Duration
              </Th>
              <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                Price
              </Th>
              <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                Actions
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {courses?.length === 0 ? (
              <Tr>
                <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                  You have not added any course yet.
                </Td>
              </Tr>
            ) : (
              courses?.map((course) => {
                return (
                  <Tr
                    key={course._id}
                    className="flex gap-x-10 border-b border-richblack-700 px-6 py-8"
                  >
                    <Td className="flex flex-1 gap-x-4">
                      <img
                        src={course?.thumbnail}
                        alt={course?.courseName}
                        className="h-[148px] w-[220px] rounded-lg object-cover"
                      />
                      <div className="flex flex-col justify-between">
                        <p className="text-lg font-semibold text-richblack-5">
                          {course?.courseName}
                        </p>
                        <p className="text-xs text-richblack-300">
                          {course?.courseDescription.split(" ").length > 30
                            ? course?.courseDescription
                                .split(" ")
                                .slice(0, 30)
                                .join(" ") + "..."
                            : course?.courseDescription}
                        </p>
                        <p className="text-xs text-richblack-5">
                          Created: {formatDate(course?.createdAt)}
                        </p>
                        {course?.status === COURSE_STATUS.DRAFT ? (
                          <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                            <HiClock size={14} />
                            Drafted
                          </p>
                        ) : (
                          <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                            <FaCheck size={14} />
                            Published
                          </p>
                        )}
                      </div>
                    </Td>
                    <Td className="text-sm font-medium text-richblack-100">
                      {course?.totalDuration}
                    </Td>
                    <Td className="text-sm font-medium text-richblack-100">
                      ₹{course?.price}
                    </Td>
                    <Td className="text-sm font-medium text-richblack-100">
                      <button
                        disabled={loading}
                        className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                        onClick={() =>
                          navigate(`/dashboard/edit-course/${course._id}`)
                        }
                        title="Edit"
                      >
                        <FiEdit2 size={20} />
                      </button>
                      <button
                        disabled={loading}
                        onClick={() => {
                          setConfirmationModal({
                            text1: "Do you want to delete this course?",
                            text2:
                              "All the data related to this course will be deleted",
                            btn1Text: !loading ? "Delete" : "Loading...",
                            btn2Text: "Cancel",
                            btn1Handler: !loading
                              ? () => handleDeleteCourse(course._id)
                              : () => {},
                            btn2Handler: !loading
                              ? () => setConfirmationModal(null)
                              : () => {},
                          });
                        }}
                        title="Delete"
                        className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                      >
                        <RiDeleteBin6Line size={20} />
                      </button>
                    </Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      ) : (
        <div className="border border-richblack-700 rounded-xl">
          {/* This code will only run for screen size less than 640px */}
          <div>
            <div className="flex flex-col justify-between">
              {courses?.map((course) => (
                <div
                  key={course._id}
                  className="flex flex-col gap-y-4 border-b border-richblack-700 px-6 py-8"
                >
                  {/* Thumbnail image */}
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="rounded-md"
                  />

                  {/* Card */}
                  <div className="flex flex-col gap-y-1 items-center">
                    <p className="text-lg font-semibold text-richblack-5">
                      {course?.courseName}
                    </p>
                    <p className="text-xs text-richblack-300">
                      {course?.courseDescription.split(" ").length > 30
                        ? course?.courseDescription
                            .split(" ")
                            .slice(0, 30)
                            .join(" ") + "..."
                        : course?.courseDescription}
                    </p>
                    <p className="text-xs text-richblack-5">
                      Created: {formatDate(course?.createdAt)}
                    </p>
                    {course?.status === COURSE_STATUS.DRAFT ? (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Drafted
                      </p>
                    ) : (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <FaCheck size={14} />
                        Published
                      </p>
                    )}
                  </div>

                  <div className="flex gap-x-20 justify-center">
                    {/* Duration */}
                    <div className="text-sm flex flex-col items-center font-medium text-richblack-100">
                      <p>Duration</p>
                      <p className="text-richblack-5">
                        {course?.totalDuration}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-sm flex flex-col items-center font-medium text-richblack-100">
                      <p>Price</p>
                      <p className="text-richblack-5">₹ {course?.price}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-y-2 items-center">
                    <p className="text-sm font-medium text-richblack-100">
                      Actions
                    </p>
                    <div className="text-sm font-medium text-richblack-100">
                      <button
                        disabled={loading}
                        className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                        onClick={() =>
                          navigate(`/dashboard/edit-course/${course._id}`)
                        }
                        title="Edit"
                      >
                        <FiEdit2 size={20} />
                      </button>
                      <button
                        disabled={loading}
                        onClick={() => {
                          setConfirmationModal({
                            text1: "Do you want to delete this course?",
                            text2:
                              "All the data related to this course will be deleted",
                            btn1Text: !loading ? "Delete" : "Loading...",
                            btn2Text: "Cancel",
                            btn1Handler: !loading
                              ? () => handleDeleteCourse(course._id)
                              : () => {},
                            btn2Handler: !loading
                              ? () => setConfirmationModal(null)
                              : () => {},
                          });
                        }}
                        title="Delete"
                        className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                      >
                        <RiDeleteBin6Line size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {confirmationModal && (
        <ComnfirmationModal modalData={confirmationModal} />
      )}
    </>
  );
};

export default InstructorCourses;
