import jwtDecode from "jwt-decode";
import { verify, sign } from "jsonwebtoken";
import userAxios from "./axios/v1/userAxios";
import adminAxios from "./axios/v1/adminAxios";
import { UserRole } from "../constants";

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

//  const handleTokenExpired = (exp) => {
//   let expiredTimer;

//   window.clearTimeout(expiredTimer);
//   const currentTime = Date.now();
//   const timeLeft = exp * 1000 - currentTime;
//   console.log(timeLeft);
//   expiredTimer = window.setTimeout(() => {
//     console.log('expired');
//   }, timeLeft);
// };

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    userAxios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // handleTokenExpired(exp);
  } else {
    localStorage.removeItem("accessToken");
    delete userAxios.defaults.headers.common.Authorization;
  }
};

const setSuperSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessSuperToken", accessToken);
    adminAxios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    userAxios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessSuperToken");
    delete adminAxios.defaults.headers.common.Authorization;
    delete userAxios.defaults.headers.common.Authorization;
  }
};
const isSuperAdmin = (role) => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return true;
    default:
      return false;
  }
};

export {
  verify,
  sign,
  isValidToken,
  setSession,
  setSuperSession,
  isSuperAdmin,
};
