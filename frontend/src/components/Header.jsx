import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../reducers/userSlice";
import axios from "axios";
import { API_URLS } from "../apiUrls";
import toast from "react-hot-toast";

const Header = ({ onAddClick }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

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
    <div className="flex justify-between items-center p-4 bg-black text-white">
      <div>
        <h2 className="text-lg font-semibold">
          Welcome, {user?.username || "User"}! 👋
        </h2>
        <p className="text-gray-500">{user?.email}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onAddClick}
          className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 cursor-pointer"
        >
          + Add Task
        </button>
        <button
          onClick={handleLogout}
          className="border border-white px-3 py-1 rounded hover:bg-gray-800 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Header;
