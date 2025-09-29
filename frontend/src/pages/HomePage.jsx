import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../reducers/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../apiUrls";
import toast from "react-hot-toast";

const HomePage = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch tasks for this user
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URLS.GET_USERS + `/${user.username}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchTasks();
    }
  }, [user]);

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask) return toast.error("Task cannot be empty");
    setLoading(true);
    try {
      await axios.post(`${API_URLS.GET_USERS}/${user.username}/tasks`, {
        title: newTask,
      });
      setNewTask("");
      fetchTasks();
      toast.success("Task added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  // Update task (toggle completed)
  const handleToggleTask = async (taskId, completed) => {
    try {
      await axios.patch(`${API_URLS.GET_USERS}/${user.username}/tasks/${taskId}`, {
        completed: !completed,
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
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

  // Logout
  const handleLogout = () => {
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

      {/* Tasks Section */}
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>

        {/* Add Task */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow border border-gray-300 p-2 rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        {/* Task List */}
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center border p-2 rounded-md"
              >
                <div
                  onClick={() => handleToggleTask(task.id, task.completed)}
                  className={`cursor-pointer ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePage;
