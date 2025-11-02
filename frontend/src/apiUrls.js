console.log("Env Vars:", import.meta.env.BACKEND_API_URL, import.meta.env.VITE_BACKEND_API_URL, window.__BACKEND_API_URL__);
const BASE_URL = "";
if (window.__BACKEND_API_URL__) {
  console.log("App is running on k8s cluster => that has set window.__BACKEND_API_URL__ as : ", window.__BACKEND_API_URL__);
  console.log("Thus using proxy as '/' for backend calls");
}
else {
  console.log("App is running locally => thus using local backend url");
  BASE_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5001"; // match your docker port
}

console.log("Final API URL:", BASE_URL);

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

