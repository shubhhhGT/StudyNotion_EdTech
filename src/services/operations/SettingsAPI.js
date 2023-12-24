import { apiConnector } from "../apiconnector";
import { settingsEndpoints } from "../apis";
import { toast } from "react-hot-toast";
import { setUser } from "../../slices/profileSlice";
import { logout } from "./authAPI";

const {
  UPDATE_PROFILE_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

export function updateProfiepicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_PROFILE_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("UPDATE_PROFILE_PICTURE_API RESPONSE...", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Profile Picture Updated Successfuly");
      dispatch(setUser(response.data.data));
    } catch (error) {
      console.log("UPDATE_PROFILE_PICTURE_API ERROR...", error);
      toast.error("Could Not Update Profile Picture!");
    }
    toast.dismiss(toastId);
  };
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      });

      console.log("UPDATE_PROFILE_API RESPONSE...", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const userImage = response.data.updatedUserDetails.image
        ? response.data.updatedUserDetails.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`;
      dispatch(
        setUser({ ...response.data.updatedUserDetails, image: userImage })
      );
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("UPDATE_PROFILE_API ERROR...", error);
      toast.error("Could not update profile");
    }
    toast.dismiss(toastId);
  };
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("PUT", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    });

    console.log("CHANGE_PASSWORD_API RESPONSE...", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Password Changed Successfuly");
  } catch (error) {
    console.log("CHANGE_PASSWORD_API ERROR...", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });

      console.log("DELETE_PROFILE_API RESPONSE...", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Profile Deleted Successfully");
      dispatch(logout(navigate));
    } catch (error) {
      console.log("DELETE_PROFILE_API ERROR...", error);
      toast.error("Could not delete profile");
    }
    toast.dismiss(toastId);
  };
}
