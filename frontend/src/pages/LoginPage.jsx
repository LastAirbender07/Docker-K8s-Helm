import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../components/InputField";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URLS } from "../apiUrls";
import { setUser } from "../reducers/userSlice";
import { sha256 } from "js-sha256";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user?.username) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = loginData;

    if (!username || !password) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);
    try {
      const hashedPassword = sha256(password);
      // const response = await axios.post(API_URLS.LOGIN, { username, password: hashedPassword });

      // testing response data
      const response = { data: { username, email: "test@example.com", gender: "male" } };

      dispatch(setUser(response.data));
      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex rounded-lg overflow-hidden z-50 bg-gray-300">
        <div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-2 text-black text-center">Login</h1>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Welcome back! Log in to your account
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="Username"
                id="username"
                name="username"
                value={loginData.username}
                onChange={handleChange}
              />

              <InputField
                label="Password"
                id="password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="text-black hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
