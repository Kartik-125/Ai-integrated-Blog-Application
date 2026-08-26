import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets.js";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { axios, adminToken } = useAppContext();
  const navigate = useNavigate();

  const BlogDate = blog.createdAt
    ? new Date(blog.createdAt)
    : null;

  // =========================
  // Delete Blog
  // =========================
  const deleteBlog = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.post(
        "/blog/delete",
        {
          blogId: blog._id,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete blog");
    }
  };

  // =========================
  // Status Badge
  // =========================
  const getStatusStyle = () => {
    if (blog.status === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (blog.status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const getStatusText = () => {
    if (blog.status === "approved") {
      return "Approved";
    }

    if (blog.status === "rejected") {
      return "Rejected";
    }

    return "Pending Review";
  };

  return (
    <tr className="border-y border-gray-300">

      {/* Index */}
      <th className="px-2 py-4">
        {index}
      </th>

      {/* Blog */}
      <td className="px-2 py-4">
        <div className="flex items-center gap-3">

          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-12 h-10 object-cover rounded"
            />
          )}

          <span className="font-medium">
            {blog.title}
          </span>

        </div>
      </td>

      {/* Date */}
      <td className="px-2 py-4 max-sm:hidden">
        {BlogDate
          ? BlogDate.toDateString()
          : "-"}
      </td>

      {/* Status */}
      <td className="px-2 py-4">
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle()}`}
        >
          {getStatusText()}
        </span>
      </td>

      {/* Actions */}
      <td className="px-2 py-4">

        <div className="flex items-center gap-3">

          {/* Read */}
          <button
            onClick={() =>
              navigate(`/admin/blogs/${blog._id}`)
            }
            className="border border-blue-500 text-blue-600 px-3 py-1 rounded hover:bg-blue-50"
          >
            Read
          </button>

          {/* Delete */}
          <img
            onClick={deleteBlog}
            src={assets.cross_icon}
            alt="Delete"
            className="w-7 hover:scale-110 transition-all cursor-pointer"
          />

        </div>

      </td>

    </tr>
  );
};

export default BlogTableItem;