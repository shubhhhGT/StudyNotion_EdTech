import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

const CourseThumbnail = ({
  label,
  name,
  register,
  errors,
  setValue,
  editData = null,
  viewData = null,
  video = false,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  );

  const inputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
    }
  };

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  });

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  useEffect(() => {
    register(name, { required: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register]);

  useEffect(() => {
    setValue(name, selectedFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue]);

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name} className="text-sm text-richblack-5">
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex minh-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-richblack-500`}
      >
        {/* If there is a preview source for the thumbnail then show it else show an input field to drag and drop or select thumbnail */}
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {/* If there is video then show the video else show the image */}
            {!video ? (
              <img
                src={previewSource}
                alt="preview"
                className="w-full h-full rounded-md object-cover"
              />
            ) : (
              <ReactPlayer
                aspectRatio="16:9"
                playsInline={true}
                controls={true}
                width="100%"
                height="100%"
                className="rounded-md"
                url={previewSource}
              />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="mt-3 text-richblack-400 underline hover:text-yellow-50"
              >
                cancel
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex w-full flex-col items-center p-6"
            {...getRootProps()}
          >
            <input {...getInputProps()} ref={inputRef} />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800 ">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200 ">
              Drag and drop an {video ? "video" : "image"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span> a
              file
            </p>
            <p className="mt-2 text-center text-sm text-richblack-200">
              Max 6MB each (12MB for videos)
            </p>
            <ul className="mt-10 list-disc flex justify-between space-x-12 text-center text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024×576</li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {" "}
          {label} is required.
        </span>
      )}
    </div>
  );
};

export default CourseThumbnail;
