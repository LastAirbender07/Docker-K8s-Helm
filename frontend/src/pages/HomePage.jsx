import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Header from "../components/Header";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

// ✅ Dummy tasks for testing UI
const dummyTasks = [
  {
    id: 1,
    title: "Finish project documentation",
    description: "Prepare the full README for deployment",
    type: "WORK",
    due_date: "2025-10-15",
    progress: 75,
  },
  {
    id: 2,
    // Very big Title to test overflow handling
    title:
      "Grocery Shopping for the week including some extra items for the weekend party",
    description: "Buy fruits, milk, and cleaning supplies",
    type: "PERSONAL",
    due_date: "2025-10-14",
    progress: 20,
  },
  {
    id: 3,
    title: "Read 'Atomic Habits'",
    // Need a realy very long valid description to test overflow handling in the task card component. This should ideally be a few sentences long to see how the UI manages larger text blocks without breaking the layout or causing overflow issues.
    description:
      "Atomic Habits by James Clear is a comprehensive guide on how to build good habits and break bad ones. The book delves into the science of habit formation, providing practical strategies for making small changes that lead to significant improvements over time. Clear emphasizes the importance of focusing on systems rather than goals, suggesting that by optimizing our daily routines, we can achieve lasting success. The book is filled with real-life examples and actionable advice, making it a valuable resource for anyone looking to improve their life through better habits.",
    type: "STUDY",
    due_date: "2025-10-20",
    progress: 40,
  },
];

const HomePage = () => {
  const user = useSelector((state) => state.user.user);
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const loadTasks = async () => {
    try {
      // if (user?.username) {
      //   const data = await getTasks(user.username);
      //   const validTasks = Array.isArray(data) ? data : Array.isArray(data?.tasks) ? data.tasks : [];
      //   setTasks(validTasks);
      // } else {
      setTasks(dummyTasks);
      // }
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Failed to load tasks, loading sample data.");
      setTasks(dummyTasks);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  const handleAddTask = async (task) => {
    try {
      await addTask({ ...task, username: user.username });
      toast.success("Task added successfully");
      setModalVisible(false);
      loadTasks();
    } catch {
      toast.error("Failed to add task");
    }
  };

  const handleUpdateTask = async (task) => {
    try {
      await updateTask(task.id, task);
      toast.success("Task updated successfully");
      setModalVisible(false);
      loadTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(taskToDelete.id);
      toast.success("Task deleted successfully");
      setConfirmVisible(false);
      loadTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        onAddClick={() => {
          setSelectedTask(null);
          setModalVisible(true);
        }}
      />

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {Array.isArray(tasks) && tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setSelectedTask(t);
                  setModalVisible(true);
                }}
                onDelete={(t) => {
                  setTaskToDelete(t);
                  setConfirmVisible(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-md text-center text-gray-600">
            <p className="mb-2 font-medium">No tasks are present here.</p>
            <p className="mb-4 text-sm">Add tasks to track them here.</p>
            <button
              onClick={() => {
                setSelectedTask(null);
                setModalVisible(true);
              }}
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Task
            </button>
          </div>
        )}
      </div>

      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={selectedTask ? handleUpdateTask : handleAddTask}
        task={selectedTask}
        overlayClass="bg-black/20 backdrop-blur-sm" // translucent overlay
      />

      <ConfirmDialog
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleDeleteTask}
        message="Are you sure you want to delete this task?"
        overlayClass="bg-black/20 backdrop-blur-sm"
      />

      <footer className="text-gray-300 bg-white border-t">
        <p className="p-3 text-center text-sm text-gray-500"> © 2025 Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
