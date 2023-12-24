import toast from "react-hot-toast";
import { profileEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";

const { GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API } =
  profileEndpoints;

export async function getEnrolledCourses(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("GET_USER_ENROLLED_COURSES_API RESPONSE...", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    result = response.data.data;
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API ERROR...", error);
    toast.error("Could not get enrolled courses");
  }
  toast.dismiss(toastId);
  return result;
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    });

    console.log("GET_INSTRUCTOR_DATA_API RESPONSE...", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    result = response.data.courses;
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API ERROR...", error);
    toast.error("Could not get Instructor data");
  }
  toast.dismiss(toastId);
  return result;
}
