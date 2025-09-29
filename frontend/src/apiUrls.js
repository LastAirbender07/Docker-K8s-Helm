const BASE_URL = import.meta.env.BACKEND_API_URL || "http://localhost:8000";
console.log("API URL:", BASE_URL);

export const API_URLS = {
  LOGIN: `${BASE_URL}/auth/login`,
  SIGNUP: `${BASE_URL}/auth/signup`,
  PENDING_USERS: `${BASE_URL}/auth/pending-users`,
  UPDATE_ROLE: `${BASE_URL}/auth/update-role`,
  DELETE_USER: `${BASE_URL}/auth/delete-user`,
  GET_USERS: `${BASE_URL}/api/users`,
};