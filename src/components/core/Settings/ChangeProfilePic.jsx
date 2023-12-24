import React, { useEffect, useRef, useState } from "react";
import Iconbtn from "../../../common/Iconbtn";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateProfiepicture } from "../../../services/operations/SettingsAPI";

const ChangeProfilePic = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setImageFile(file);
    previewFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);

  const handleFileupload = () => {
    try {
      console.log("Uploading...");
      setLoading(true);
      const formData = new FormData();
      formData.append("profilePicture", imageFile);
      dispatch(updateProfiepicture(token, formData)).then(() => {
        setLoading(false);
      });
    } catch (error) {
      console.log("Error message...", error.message);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
      <div className="flex flex-col gap-y-1 sm:gap-y-0 w-full sm:flex-row items-center gap-x-4">
        <img
          src={previewSource || user?.image}
          alt={`profile-${user?.firstName}`}
          className="w-[78px] aspect-square rounded-full object-cover"
        />

        <div className="space-y-2 flex flex-col items-center sm:items-start">
          <p>Change Profile Picture</p>
          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/png, image/gif, image/jpg, image/jpeg"
            />
            <button
              onClick={handleClick}
              className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
            >
              Select
            </button>
            <Iconbtn
              text={loading ? "Uploading..." : "Upload"}
              onclick={handleFileupload}
            >
              {!loading && <FiUpload className="text-lg text-richblack-900" />}
            </Iconbtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePic;
