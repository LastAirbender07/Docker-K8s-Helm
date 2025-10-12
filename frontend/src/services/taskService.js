import axios from "axios";
import { API_URLS } from "../apiUrls";

export const getTasks = async (username) => {
  const response = await axios.get(API_URLS.GET_TASKS(username));
  return response.data;
};

export const addTask = async (username, task) => {
  const response = await axios.post(API_URLS.ADD_TASK(username), task);
  return response.data;
};

export const updateTask = async (username, taskId, updatedTask) => {
  const response = await axios.patch(API_URLS.UPDATE_TASK(username, taskId), updatedTask);
  return response.data;
};

export const deleteTask = async (username, taskId) => {
  const response = await axios.delete(API_URLS.DELETE_TASK(username, taskId));
  return response.data;
};

