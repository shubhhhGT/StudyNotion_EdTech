import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

const TagInput = ({
  label,
  name,
  placeholder,
  errors,
  register,
  setValue,
  getValues,
}) => {
  const { editCourse, course } = useSelector((state) => state.course);

  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    // Check if the course is being edited
    if (editCourse) {
      setTagList(course?.tag);
    }
    register(name, { required: true, validate: (value) => value.length > 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(name, tagList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagList]);

  const handleKeyDown = (event) => {
    // Check if user presses 'Enter' or ','
    if (event.key === "Enter" || event.key === ",") {
      // Prevent default behavior
      event.preventDefault();

      // Remove the trailing/leading spaces
      const tagValue = event.target.value.trim();

      // Check if the input value already exists in the tag list
      if (tagValue && !tagList.includes(tagValue)) {
        // Add the new tag with all other tags in the taglist
        const newTagList = [...tagList, tagValue];
        setTagList(newTagList);
        // Clear the input
        event.target.value = "";
      }
    }
  };

  const handleDeleteTag = (tagListindex) => {
    const newTagList = tagList.filter((_, index) => index !== tagListindex);
    setTagList(newTagList);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name} className="text-sm text-richblack-5">
        {label} <sup className="text-pink-200">*</sup>
      </label>

      {/* Render the tags on input */}
      <div className="flex w-full flex-wrap gap-y-2">
        {tagList.map((tag, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-yellow-400 text-richblack-5 px-2 p-1 text-sm"
          >
            {/* The tag value to be rendered */}
            {tag}
            {/* A button to remove the tag */}
            <button
              type="button"
              onClick={() => handleDeleteTag(index)}
              className="ml-2 focus:outline-none"
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        id={name}
        name={name}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="form-style !bg-richblack-700 w-full"
      />

      {/* Handle error */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required.
        </span>
      )}
    </div>
  );
};

export default TagInput;
