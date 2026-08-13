import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext.jsx";

import MyBlogsTable from "../../components/user/MyBlogsTable.jsx";
import EmptyBlogs from "../../components/user/EmptyBlogs.jsx";

const MyBlogs = () => {
  const { axios, userToken } = useAppContext();

  const [blogs, setBlogs] = useState([]);

  const fetchMyBlogs = async () => {
    try {
      const { data } = await axios.get("/blog/my-blogs", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch your blogs");
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  return (
    <div className="flex-1 bg-blue-50/50 p-5 sm:p-10 overflow-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            My Blogs
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage the blogs you have created.
          </p>
        </div>

        <Link
          to="/dashboard/create-blog"
          className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm"
        >
          Create Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <EmptyBlogs />
      ) : (
        <MyBlogsTable blogs={blogs} />
      )}

    </div>
  );
};

export default MyBlogs;