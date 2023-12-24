import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaBook, FaBookOpen } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiFillCaretDown, AiOutlinePlus } from "react-icons/ai";
import SubSectionModal from "./SubSectionModal";
import ComnfirmationModal from "../../../../../common/ComnfirmationModal";
import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";

const NestedView = ({ handleChangeEditSectionName }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [addSubSection, setAddSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);

  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleteSection = async (sectionId) => {
    // Call delete section API
    const result = await deleteSection(
      {
        sectionId,
        courseId: course._id,
      },
      token
    );

    // Set the course as per updated data
    if (result) {
      dispatch(setCourse(result));
    }

    // Remove the confirmation modal after deleting the section
    setConfirmationModal(null);
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection(
      {
        subSectionId,
        sectionId,
      },
      token
    );

    if (result) {
      // Here The api returns updatedSubSection
      // So create a updated course as per updated sunsection and then dispatch it to set the course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }

    setConfirmationModal(null);
  };

  return (
    <div>
      <div className="p-6 text-white rounded-lg bg-richblack-700 px-8">
        {course.courseContent.map((section) => (
          <details key={section._id} open>
            {/* Sections */}
            <summary className="flex cursor-pointer items-center justify-between py-3 border-b-2 border-b-richblack-600">
              <div className="flex items-center gap-x-3">
                <FaBook className="text-2xl text-richblack-50" />
                <p className="font-semibold text-richblack-50">
                  {section.sectionName}
                </p>
              </div>
              <div className="flex items-center gap-x-3">
                {/* Edit Button */}
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    )
                  }
                >
                  <MdEdit className="text-xl text-richblack-300 hover:text-caribbeangreen-300" />
                </button>

                {/* Delete button */}
                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete Section",
                      text2: "All the lectures in this section will be deletd!",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300 hover:text-pink-300" />
                </button>

                <span className="font-medium text-richblack-300">|</span>
                <AiFillCaretDown className="text-xl text-richblack-300" />
              </div>
            </summary>

            {/* Subsections */}
            <div className="px-6 pb-4">
              {section.subSection.map((data) => (
                <div
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div className="flex items-center gap-x-3 py-2">
                    <FaBookOpen className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-500">
                      {data.title}
                    </p>
                  </div>

                  <div
                    className="flex items-center gap-x-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setEditSubSection({
                          ...data,
                          sectionId: section._id,
                        })
                      }
                    >
                      <MdEdit className="text-xl text-richblack-300 hover:text-caribbeangreen-300" />
                    </button>

                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Sub-Section",
                          text2: "Selected lecture will be deletd!",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                    >
                      <RiDeleteBin6Line className="text-xl text-richblack-300 hover:text-pink-300" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Lecture */}
              <button
                onClick={() => setAddSubSection(section._id)}
                className="flex mt-3 items-center gap-x-1 text-yellow-50"
              >
                <AiOutlinePlus className="text-lg" />
                <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>

      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : (
        <div></div>
      )}

      {confirmationModal ? (
        <ComnfirmationModal modalData={confirmationModal} />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default NestedView;
