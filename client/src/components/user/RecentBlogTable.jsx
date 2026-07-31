import React from "react";
import { Link } from "react-router-dom";

const RecentBlogsTable = ({ blogs = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8 overflow-hidden">

      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Blogs
        </h2>

        <Link
          to="/dashboard/my-blogs"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">

          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Title
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Created
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Status
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Views
              </th>
            </tr>
          </thead>

          <tbody>

            {blogs.slice(0, 5).map((blog) => (

              <tr
                key={blog._id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {blog.title}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      blog.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {blog.isPublished
                      ? "Published"
                      : "Pending Review"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {blog.views}
                </td>
              </tr>

            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
};

export default RecentBlogsTable;