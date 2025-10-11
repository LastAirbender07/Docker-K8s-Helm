import { useState } from "react";
import RadioButton from "../components/RadioButton";
import InputField from "../components/InputField";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { API_URLS } from "../apiUrls";
import axios from "axios";
import { sha256 } from "js-sha256";

// TO DO: Radio button not wokring properly

const SignUpPage = () => {
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setSignUpData((prev) => ({
      ...prev,
      [name]: type === "radio" ? value : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const { username, email, password, confirmPassword, gender } = signUpData;
    if (!username || !email || !password || !confirmPassword || !gender) {
      return toast.error("Please fill all fields");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const hashedPassword = sha256(password);
      const payload = { username, email, password: hashedPassword, gender };

      await axios.post(API_URLS.SIGNUP, payload);
      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="flex rounded-lg overflow-hidden z-50 bg-gray-300">
        <div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-2 text-black text-center">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Join to track your activities
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="Username"
                id="username"
                name="username"
                value={signUpData.username}
                onChange={handleChange}
              />

              <InputField
                label="Email"
                id="email"
                name="email"
                type="email"
                value={signUpData.email}
                onChange={handleChange}
              />

              <InputField
                label="Password"
                id="password"
                name="password"
                type="password"
                value={signUpData.password}
                onChange={handleChange}
              />

              <InputField
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={signUpData.confirmPassword}
                onChange={handleChange}
              />

              <div className="flex gap-10">
                <RadioButton
                  id="male"
                  label="Male"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                  checked={signUpData.gender === "male"}
                />
                <RadioButton
                  id="female"
                  label="Female"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                  checked={signUpData.gender === "female"}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-black hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
