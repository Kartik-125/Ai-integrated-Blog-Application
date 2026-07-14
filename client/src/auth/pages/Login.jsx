import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 flex items-center justify-center px-4">

      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">

        <div className="text-center">

          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 mt-2">
            Login to continue reading and publishing blogs.
          </p>

        </div>

        <form className="mt-8 space-y-5">

          <div>

            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 border rounded-lg p-3 outline-none focus:border-primary"
            />

          </div>

          <div>

            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative mt-2">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border rounded-lg p-3 outline-none focus:border-primary"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-sm text-primary"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          <div className="flex justify-between text-sm">

            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          <button
            className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition"
          >
            Login
          </button>

        </form>

        <p className="text-center text-sm mt-6">

          Don't have an account?

          <Link
            to="/register"
            className="text-primary font-semibold ml-1 hover:underline"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Login;