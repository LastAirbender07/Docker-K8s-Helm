import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../reducers/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../apiUrls";
import toast from "react-hot-toast";

import InputField from "../components/InputField";
import RadioButton from "../components/RadioButton";

const taskTypes = ["PERSONAL", "WORK", "STUDY", "HOBBY", "OTHER"];

// TO DO: Change UI Layout

const HomePage = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    type: "OTHER",
    due_date: "",
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState({});

  // Fetch tasks
  const fetchTasks = async () => {
    if (!user?.username) return;
    try {
      const res = await axios.get(`${API_URLS.GET_USERS}/${user.username}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return toast.error("Title cannot be empty");

    setLoading(true);
    try {
      await axios.post(`${API_URLS.GET_USERS}/${user.username}/tasks`, newTask);
      setNewTask({ title: "", description: "", type: "OTHER", due_date: "" });
      fetchTasks();
      toast.success("Task added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URLS.GET_USERS}/${user.username}/tasks/${taskId}`);
      fetchTasks();
      toast.success("Task deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

  // Toggle completed
  const handleToggleTask = async (task) => {
    try {
      await axios.patch(`${API_URLS.GET_USERS}/${user.username}/tasks/${task.id}`, {
        completed: !task.completed,
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  // Start editing a task
  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTask({
      title: task.title,
      description: task.description || "",
      type: task.type || "OTHER",
      due_date: task.due_date ? task.due_date.split("T")[0] : "",
      completed: task.completed,
    });
  };

  // Save edited task
  const saveTask = async (taskId) => {
    try {
      await axios.patch(`${API_URLS.GET_USERS}/${user.username}/tasks/${taskId}`, editingTask);
      setEditingTaskId(null);
      setEditingTask({});
      fetchTasks();
      toast.success("Task updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post(API_URLS.LOGOUT, null, { withCredentials: true });
    } catch {}
    dispatch(clearUser());
    toast.success("Signed out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded shadow">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.username || "User"} 👋
          </h1>
          <p className="text-gray-500">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Sign Out
        </button>
      </div>

      {/* Add Task */}
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <form onSubmit={handleAddTask} className="space-y-2">
          <InputField
            label="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <InputField
            label="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <div className="flex gap-2 items-center">
            <span className="font-semibold">Type:</span>
            {taskTypes.map((type) => (
              <RadioButton
                key={type}
                label={type}
                name="taskType"
                value={type}
                checked={newTask.type === type}
                onChange={() => setNewTask({ ...newTask, type })}
              />
            ))}
          </div>
          <InputField
            label="Due Date"
            type="date"
            value={newTask.due_date}
            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="border p-4 rounded-md flex justify-between items-start">
                {editingTaskId === task.id ? (
                  <div className="flex-1 space-y-2">
                    <InputField
                      label="Title"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    />
                    <InputField
                      label="Description"
                      value={editingTask.description}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, description: e.target.value })
                      }
                    />
                    <div className="flex gap-2 items-center">
                      <span className="font-semibold">Type:</span>
                      {taskTypes.map((type) => (
                        <RadioButton
                          key={type}
                          label={type}
                          name={`editType-${task.id}`}
                          value={type}
                          checked={editingTask.type === type}
                          onChange={() => setEditingTask({ ...editingTask, type })}
                        />
                      ))}
                    </div>
                    <InputField
                      label="Due Date"
                      type="date"
                      value={editingTask.due_date}
                      onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveTask(task.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTaskId(null)}
                        className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <h3
                      onClick={() => handleToggleTask(task)}
                      className={`cursor-pointer font-semibold ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && <p className="text-gray-500">{task.description}</p>}
                    <p className="text-sm text-gray-400">Type: {task.type}</p>
                    {task.due_date && (
                      <p className="text-sm text-gray-400">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-2 ml-4">
                  {editingTaskId !== task.id && (
                    <button
                      onClick={() => startEditTask(task)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePage;
