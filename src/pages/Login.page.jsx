import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import https from "../helpers/https"; // pastikan ini benar
import { toast } from "react-toastify";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (!trimmedUsername) return;

    try {
      const { data } = await https.post("/login", {
        username: trimmedUsername,
      });

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/home");
      toast.success("Login Successful");
    } catch (err) {
      console.log(err);
      setErrorMessage(err?.response?.data?.message || "Login failed");
    }
  };

  async function handleCredentialResponse(response) {
    const { credential } = response;
    try {
      const { data } = await https.post("/login/google", {
        googleToken: credential,
      });

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_google", JSON.stringify(data.user));

      navigate("/home");
      toast.success("Login Successful");
    } catch (err) {
      console.log(err);
      setErrorMessage(err?.response?.data?.message || "Login failed");
    }
  }

  useEffect(() => {
    window.onload = function () {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" }
      );
      window.google.accounts.id.prompt();
    };
  }, []);

  const handleRegister = () => {
    navigate("/register");
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
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
          Welcome to ChatVerse
        </h1>

        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
          </div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
          >
            Join ChatVerse
          </motion.button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
          <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm">
            or
          </span>
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
        </div>

        <div className="space-y-3">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            id="buttonDiv"
            className="w-full flex items-center justify-center bg-white text-gray-800 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
          >
            <img
              src="path_to_google_logo.png"
              alt="Google Logo"
              className="mr-3 w-6 h-6"
            />
            Login with Google
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full flex items-center justify-center bg-white dark:bg-gray-800 text-gray-800 dark:text-white py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
          >
            Login with GitHub
          </motion.button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Don't have an account?{" "}
            <motion.span
              onClick={handleRegister}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register here
            </motion.span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
