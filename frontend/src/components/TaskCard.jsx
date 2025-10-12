import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const TYPE_COLORS = {
  WORK: "bg-blue-200 text-blue-800",
  PERSONAL: "bg-pink-200 text-pink-800",
  STUDY: "bg-yellow-200 text-yellow-800",
  HEALTH: "bg-green-200 text-green-800",
  OTHER: "bg-gray-200 text-gray-800",
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  // Limit title and description length
  const titleLimit = 60;
  const descLimit = 400;

  const title =
    task.title.length > titleLimit
      ? task.title.slice(0, titleLimit)
      : task.title;

  const description =
    task.description.length > descLimit
      ? task.description.slice(0, descLimit)
      : task.description;

  const typeStyle = TYPE_COLORS[task.type?.toUpperCase()] || TYPE_COLORS.OTHER;

  return (
    <div className="bg-white h-52 px-4 pt-4 pb-2 rounded-xl shadow-md hover:shadow-lg transition flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-800 leading-tight max-w-[70%]">
          {title}
        </h3>
        <div className="text-right">
          <p className="text-xs text-gray-500">
            Due: {new Date(task.due_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 mt-2 overflow-hidden">
        <p className="text-gray-600 text-sm leading-snug">{description}</p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${typeStyle}`}
        >
          {task.type}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-700 cursor-pointer transition"
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="text-red-600 hover:text-red-700 cursor-pointer transition"
          >
            <MdDelete size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
