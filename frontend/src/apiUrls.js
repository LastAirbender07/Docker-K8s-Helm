const BASE_URL = import.meta.env.BACKEND_API_URL || "http://localhost:5001"; // match your docker port
console.log("Environment Variable:", import.meta.env.BACKEND_API_URL);
console.log("API URL:", BASE_URL);

export const API_URLS = {
  // Authentication
  LOGIN: `${BASE_URL}/auth/login`,
  SIGNUP: `${BASE_URL}/auth/signup`,
  LOGOUT: `${BASE_URL}/auth/logout`,

  // Users / Tasks
  GET_USERS: `${BASE_URL}/api/users`, // For fetching user tasks: GET /api/users/{username}/tasks
  CREATE_TASK: `${BASE_URL}/api/users`, // POST /api/users/{username}/tasks
  UPDATE_TASK: `${BASE_URL}/api/users`, // PATCH /api/users/{username}/tasks/{task_id}
  DELETE_TASK: `${BASE_URL}/api/users`, // DELETE /api/users/{username}/tasks/{task_id}
};
