// const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5001"; // match your docker port

// const BASE_URL = window.__BACKEND_API_URL__ || "http://localhost:5001"; // default fallback
const BASE_URL = "";
console.log("Environment Variable:", import.meta.env.BACKEND_API_URL, import.meta.env.VITE_BACKEND_API_URL, window.__BACKEND_API_URL__);
console.log("API URL:", BASE_URL);

export const API_URLS = {
  // Authentication
  LOGIN: `${BASE_URL}/auth/login`,
  SIGNUP: `${BASE_URL}/auth/signup`,
  LOGOUT: `${BASE_URL}/auth/logout`,

  // Users / Tasks
  GET_TASKS: (username) => `${BASE_URL}/api/users/${username}/tasks`,
  ADD_TASK: (username) => `${BASE_URL}/api/users/${username}/tasks`,
  UPDATE_TASK: (username, taskId) => `${BASE_URL}/api/users/${username}/tasks/${taskId}`,
  DELETE_TASK: (username, taskId) => `${BASE_URL}/api/users/${username}/tasks/${taskId}`,
};

