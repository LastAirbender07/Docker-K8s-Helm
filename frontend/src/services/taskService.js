import axios from "axios";
import { API_URLS } from "../apiUrls";

export const getTasks = async (username) => {
  const response = await axios.get(`${API_URLS.GET_TASKS}?username=${username}`);
  return response.data;
};

export const addTask = async (task) => {
  const response = await axios.post(API_URLS.ADD_TASK, task);
  return response.data;
};

export const updateTask = async (taskId, updatedTask) => {
  const response = await axios.put(`${API_URLS.UPDATE_TASK}/${taskId}`, updatedTask);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axios.delete(`${API_URLS.DELETE_TASK}/${taskId}`);
  return response.data;
};
