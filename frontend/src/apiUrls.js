console.log("Env Vars:", window.__BACKEND_API_URL__);
let BASE_URL = "";

if (window.__BACKEND_API_URL__ && window.__BACKEND_API_URL__.includes("localhost")) {
  console.log("App is running locally => thus using local backend url");
  BASE_URL = window.__BACKEND_API_URL__;
} else {
  console.log("App is running on k8s cluster => using proxy");
  BASE_URL = "";
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

