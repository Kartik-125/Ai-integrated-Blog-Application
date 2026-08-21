import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public Pages
import Home from "./pages/Home";
import Blog from "./pages/Blog";

// User Auth Pages
import LoginPage from "./auth/pages/Login";
import RegisterPage from "./auth/pages/Register";
import ForgotPasswordPage from "./auth/pages/ForgotPassword";
import ResetPasswordPage from "./auth/pages/ResetPassword";

// Admin Pages
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import Comments from "./pages/admin/Comments";
import ManageBlogs from "./pages/admin/ManageBlogs";
import Login from "./components/admin/Login";

// User Pages
import Userlayout from "./pages/user/Userlayout";
import UserDashboard from "./pages/user/UserDashboard";
import CreateBlog from "./pages/user/CreateBlog";
import MyBlogs from "./pages/user/MyBlogs";
import Profile from "./pages/user/Profile";
import EditBlog from "./pages/user/EditBlog";

// Context
import { useAppContext } from "./context/AppContext";

// Quill CSS
import "quill/dist/quill.snow.css";

const App = () => {
  const { adminToken, userToken } = useAppContext();

  return (
  <>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/blog/:id" element={<Blog />} />

      {/* User Authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />
      <Route
        path="/reset-password/:token"
        element={<ResetPasswordPage />}
      />


      {/* User Dashboard */}
      <Route
        path="/dashboard"
        element={
          userToken ? (
            <Userlayout />
          ) : (
            <LoginPage />
          )
        }
      >
        <Route index element={<UserDashboard />} />

        <Route path="create-blog" element={<CreateBlog />} />

        <Route path="my-blogs" element={<MyBlogs />} />

        <Route path="profile" element={<Profile />} />

        <Route path="edit-blog/:id" element={<EditBlog />} />
        
      </Route>
      
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          adminToken?
            <Layout/> : <Login/>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="manage-blogs" element={<ManageBlogs />} />
        <Route path="comments" element={<Comments />} />
      </Route>
    </Routes>

    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="light"
    />

  </>  
    
  );
};

export default App;