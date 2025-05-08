import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import https from "../helpers/https";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setGlobalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    try {
      await https.post("/register", {
        username,
        email,
        password,
        confirmPassword,
      });

      navigate("/login");
      toast.success("Registration successful!");
    } catch (err) {
      console.error(err);

      if (err?.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
        setGlobalError("");
      } else if (err?.response?.data?.message) {
        setGlobalError(err.response.data.message);
      } else {
        setGlobalError("Terjadi kesalahan. Silakan coba lagi.");
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)]"></div>
      <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-pink-400/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200/50 dark:border-gray-700/50"
      >
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
          Join ChatVerse
        </h2>

        {/* Global Error */}
        {globalError && (
          <p className="mb-4 text-center text-sm text-red-500 font-medium">
            {globalError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            {formErrors.username && (
              <p className="text-sm text-red-500 mb-1">{formErrors.username}</p>
            )}
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Email */}
          <div>
            {formErrors.email && (
              <p className="text-sm text-red-500 mb-1">{formErrors.email}</p>
            )}
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Password */}
          <div>
            {formErrors.password && (
              <p className="text-sm text-red-500 mb-1">{formErrors.password}</p>
            )}
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Confirm Password */}
          <div>
            {formErrors.confirmPassword && (
              <p className="text-sm text-red-500 mb-1">
                {formErrors.confirmPassword}
              </p>
            )}
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
          >
            Register
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Already have an account?{" "}
            <motion.span
              onClick={() => navigate("/login")}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login here
            </motion.span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
