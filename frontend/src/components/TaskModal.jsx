import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

const PrettoSlider = styled(Slider)({
  color: "#3b82f6",
  height: 8,
  "& .MuiSlider-track": { border: "none" },
  "& .MuiSlider-thumb": {
    height: 22,
    width: 22,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": { boxShadow: "inherit" },
    "&::before": { display: "none" },
  },
});

const TASK_TYPES = ["WORK", "PERSONAL", "STUDY", "HEALTH", "OTHER"];
const titleLimit = 60;
const descLimit = 400;

const TaskModal = ({
  visible,
  onClose,
  onSubmit,
  task,
  overlayClass = "bg-black/20 backdrop-blur-sm",
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "OTHER",
    due_date: "",
    progress: 0,
    completed: false,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        type: task.type || "OTHER",
        due_date: task.due_date || "",
        progress: task.progress ?? 0,
        completed: task.progress === 100,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        type: "OTHER",
        due_date: "",
        progress: 0,
        completed: false,
      });
    }
  }, [task]);

  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProgressChange = (_, newValue) => {
    setFormData((prev) => ({
      ...prev,
      progress: newValue,
      completed: newValue === 100,
    }));
  };

  const handleCompletedToggle = (e) => {
    const isCompleted = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      completed: isCompleted,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      progress: formData.completed ? 100 : formData.progress,
    });
  };

  return (
    <div className={`fixed inset-0 flex justify-center items-center z-50 ${overlayClass}`}>
      <div className="bg-white w-[460px] rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-3">
          {task ? "Edit Task" : "Add New Task"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          {/* Scrollable body only if needed */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter task title"
                maxLength={titleLimit}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 text-right mt-1">
                {formData.title.length}/{titleLimit}
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Describe your task"
                rows={3}
                maxLength={descLimit}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 resize-none h-[80px]"
                value={formData.description}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 text-right mt-1">
                {formData.description.length}/{descLimit}
              </p>
            </div>

            {/* Type & Date */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
                >
                  {TASK_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
                  value={formData.due_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Progress */}
            <div>
              <Typography gutterBottom>Progress: {formData.progress}%</Typography>
              <Box sx={{ px: 1 }}>
                <PrettoSlider
                  value={formData.progress}
                  onChange={handleProgressChange}
                  aria-label="progress slider"
                  valueLabelDisplay="auto"
                />
              </Box>
            </div>

            {/* Completed Toggle */}
            <div className="flex items-center gap-2 mt-2">
              <Switch
                checked={formData.completed}
                onChange={handleCompletedToggle}
                color="primary"
              />
              <span className="text-gray-700 font-medium">Mark as Completed</span>
            </div>
          </div>

          {/* Footer - now *inside* the white modal box */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              {task ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

TaskModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  task: PropTypes.object,
  overlayClass: PropTypes.string,
};

export default TaskModal;
