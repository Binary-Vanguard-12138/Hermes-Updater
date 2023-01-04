import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/admin",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if ("canceled" === error.message) {
      // This is not an error, but caused by Abort controller.
      return Promise.reject(error);
    }
    // if (error.response?.status === 401) {
    // }
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export default axiosInstance;
