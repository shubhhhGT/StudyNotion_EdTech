import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { catalogEndpoint } from "../apis";

const { CATALOG_DATA_API } = catalogEndpoint;

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("POST", CATALOG_DATA_API, {
      categoryId: categoryId,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    console.log("CATALOG_DATA_API RESPONSE...", response);

    result = response?.data;
  } catch (error) {
    console.log("CATALOG_DATA_API ERROR...", error);
    toast.error(error.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};
