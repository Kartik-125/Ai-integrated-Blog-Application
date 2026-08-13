import React from "react";
import { Link } from "react-router-dom";
import BlogStatusBadge from "./BlogStatusBadge";

const MyBlogsTable = ({ blogs = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-6 py-4 text-left">#</th>
              <th className="px-6 py-4 text-left">Blog</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Views</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((blog, index) => (
              <tr
                key={blog._id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  {index + 1}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 min-w-[220px]">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-12 h-10 object-cover rounded"
                    />

                    <div>
                      <p className="font-medium text-gray-800">
                        {blog.title}
                      </p>

                      <p className="text-xs text-gray-400">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {blog.category}
                </td>

                <td className="px-6 py-4">
                  {blog.views}
                </td>

                <td className="px-6 py-4">
                  <BlogStatusBadge
                    isPublished={blog.isPublished}
                  />
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/blog/${blog._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                    <Link
                      to={`/dashboard/edit-blog/${blog._id}`}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBlogsTable;