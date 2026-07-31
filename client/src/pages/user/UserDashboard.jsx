import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LuBookOpen,
  LuCircleCheck,
  LuClock3,
  LuEye,
} from "react-icons/lu";

import { useAppContext } from "../../context/AppContext";

import DashboardCard from "../../components/user/DashboardCard";
import RecentBlogsTable from "../../components/user/RecentBlogsTable";
import EmptyDashboard from "../../components/user/EmptyDashboard";

const UserDashboard =()  => {

  const { axios, userToken, user } = useAppContext();

  const [blogs, setBlogs] = useState([]);

  const fetchMyBlogs = async () => {
    try {

      const { data } = await axios.get(
        "/blog/my-blogs",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard.");
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const totalBlogs = blogs.length;

  const publishedBlogs = blogs.filter(
    (blog) => blog.isPublished
  ).length;

  const pendingBlogs = blogs.filter(
    (blog) => !blog.isPublished
  ).length;

  const totalViews = blogs.reduce(
    (sum, blog) => sum + blog.views,
    0
  );

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold text-gray-800">
        Welcome, {user?.name} 👋
      </h1>

      <p className="text-gray-500 mt-2">
        Here's an overview of your blogging activity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

        <DashboardCard
          title="Total Blogs"
          value={totalBlogs}
          icon={<LuBookOpen />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <DashboardCard
          title="Published"
          value={publishedBlogs}
          icon={<LuCircleCheck />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <DashboardCard
          title="Pending Review"
          value={pendingBlogs}
          icon={<LuClock3 />}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />

        <DashboardCard
          title="Total Views"
          value={totalViews}
          icon={<LuEye />}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

      </div>

      {
        blogs.length === 0
        ? <EmptyDashboard />
        : <RecentBlogsTable blogs={blogs} />
      }

    </div>
  );
};

export default UserDashboard;