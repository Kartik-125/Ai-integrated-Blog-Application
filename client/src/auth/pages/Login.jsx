import React, { useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext.jsx";

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("user");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  const {
    axios,
    setUserToken,
    setAdminToken,
    setUser,
  } = useAppContext();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
    setLoading(true);

    const endpoint =
      loginType === "user" ? "/user/login" : "/admin/login";

    const { data } = await axios.post(endpoint, {
      email,
      password,
    });

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    if (loginType === "user") {
      localStorage.setItem("userToken", data.token);

      setUserToken(data.token);

      setUser(data.user);

      toast.success(data.message);

      navigate("/");
    } else {
      localStorage.setItem("adminToken", data.token);

      setAdminToken(data.token);

      toast.success("Admin Login Successful");

      navigate("/admin");
    }

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }

  };

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

        <form onSubmit={handleLogin} className="mt-8 space-y-5">

          <div>

            <label className="text-sm font-medium text-gray-700">
              Login As
            </label>

            <div className="flex gap-6 mt-2">

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="loginType"
                  value="user"
                  checked={loginType === "user"}
                  onChange={() => setLoginType("user")}
                />
                User
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="loginType"
                  value="admin"
                  checked={loginType === "admin"}
                  onChange={() => setLoginType("admin")}
                />
                Admin
              </label>

            </div>
          </div>

          <div>

            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            type="submit"
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