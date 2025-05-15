import axios from "axios";
import toast from "react-hot-toast";

export const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  // headers: {
  //   "X-Requested-With": "XMLHttpRequest",
  // },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

const handleRequest = async (method, url, data, showToast = true) => {
  const token = JSON.parse(localStorage.getItem('token'));
  let headers = {
    Authorization: `Bearer ${token}`,
  };

  if (data instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
  } else {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await api({
      method,
      url: BASE_URL + url,
      data,
      headers,
    });

    if (showToast) {
      toast.success(response?.data?.message);
    }

    return response.data;

  } catch (error) {
    let customErrorMessage = "";

    switch (method.toLowerCase()) {
      case "get":
        customErrorMessage = "Unable to fetch data. Please try again later.";
        break;
      case "post":
        customErrorMessage = "Unable to add/update data. Please try again later.";
        break;
      case "put":
      case "patch":
        customErrorMessage = "Unable to update data. Please try again later.";
        break;
      case "delete":
        customErrorMessage = "Unable to delete data. Please try again later.";
        break;
      default:
        customErrorMessage = "An unexpected error occurred. Please try again later.";
    }
    const errorMessage =
      error.response?.data?.errors?.name ||
      error.response?.data?.errors?.type ||
      error.response?.data?.message?.error ||
      error.response?.data?.errors?.message ||
      error?.response?.data?.message ||
      customErrorMessage

    toast.error(errorMessage);
    return Promise.reject(error);
  }
};

export const getCall = (url, showToast) => handleRequest("get", url, null, showToast);
export const getById = (url, id, showToast) => handleRequest("get", `${url}/${id}`, null, showToast);
export const postCall = (url, data, showToast) => handleRequest("post", url, data, showToast);
export const putCall = (url, data, showToast) => handleRequest("post", url, data, showToast);
export const deleteCall = (url, data, showToast) => handleRequest("delete", url, data, showToast);
