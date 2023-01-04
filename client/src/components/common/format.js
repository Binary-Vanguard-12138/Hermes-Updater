import { UserRole } from "../../constants";

const formatDate = (date) => {
  if (!date) return "";
  let ret = new Intl.DateTimeFormat("en-GB", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(new Date(date));
  return ret;
};

const getHumanTimeLength = (d) => {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor((d % 3600) / 60);
  let s = Math.floor((d % 3600) % 60);

  let sResult = "";
  let hDisplay = h > 0 ? h + (h === 1 ? " hour" : " hours") : "";
  sResult += hDisplay;
  let mDisplay = m > 0 ? m + (m === 1 ? " minute" : " minutes") : "";
  if (0 < mDisplay.length) {
    if (0 < sResult.length) sResult += ", ";
    sResult += mDisplay;
  }
  let sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
  if (0 < sDisplay.length) {
    if (0 < sResult.length) sResult += ", ";
    sResult += sDisplay;
  }
  return sResult;
};

const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const formatNumbers = (bytes, decimals = 2) => {
  if (!bytes) return "0";
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const formatHttpResponseCode = (res_code) => {
  switch (res_code) {
    case 200:
      return "200 OK";
    case 201:
      return "201 Created";
    case 202:
      return "202 Accepted";
    case 204:
      return "202 Accepted";
    case 301:
      return "301 Moved Permanently";
    case 302:
      return "302 Found";
    case 400:
      return "400 Bad Request";
    case 401:
      return "401 Unauthorized";
    case 403:
      return "403 Forbidden";
    case 404:
      return "404 Not Found";
    case 405:
      return "405 Method Not Allowed";
    case 409:
      return "409 Conflict";
    case 429:
      return "429 Too Many Requests";
    case 500:
      return "500 Internal Server Error";
    case 502:
      return "502 Bad Gateway";
    case 503:
      return "503 Service Unavailable";
    default:
      return res_code + " HTTP";
  }
};

const formatFloat = (value, decimals = 1) => {
  let retVal = parseFloat(value).toFixed(decimals);
  retVal = +retVal;
  return retVal;
};

const getUserRoleString = (role) => {
  switch (role) {
    case undefined:
      return "";
    case UserRole.SUPER_ADMIN:
      return "Super Administrator";
    case UserRole.SUPPORT_ADMIN:
      return "Support Administrator";
    case UserRole.PAYMENT_ADMIN:
      return "Payment Administrator";
    case UserRole.READONLY_ADMIN:
      return "Read-only Administrator";
    case UserRole.ORGANISATION_ACCOUNT:
      return "Organisation Administrator";
    case UserRole.NORMAL_USER:
      return "Normal User";
    case UserRole.READONLY_USER:
      return "Read-only User";
    default:
      return "Unknown user";
  }
};
export {
  formatDate,
  getHumanTimeLength,
  formatBytes,
  formatNumbers,
  formatHttpResponseCode,
  formatFloat,
  getUserRoleString,
};
