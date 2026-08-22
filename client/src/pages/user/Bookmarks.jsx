import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext.jsx";

const Bookmarks = () => {
  const { axios, userToken } = useAppContext();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const { data } = await axios.get("/blog/bookmarks", {
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
      toast.error("Failed to fetch bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchBookmarks();
    }
  }, [userToken]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Loading bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-blue-50/50 p-5 sm:p-10 overflow-auto">

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Bookmarks
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Blogs you have saved for later.
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-700">
            No bookmarks yet
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Start bookmarking blogs you want to read later.
          </p>

          <Link
            to="/"
            className="inline-block mt-5 px-5 py-2.5 bg-primary text-white rounded-lg text-sm"
          >
            Explore Blogs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >

              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-5">

                <p className="text-xs text-primary font-medium mb-2">
                  {blog.category}
                </p>

                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {blog.title}
                </h2>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {blog.excerpt}
                </p>

                <div className="flex items-center justify-between mt-5">

                  <span className="text-xs text-gray-400">
                    By {blog.author?.name}
                  </span>

                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    Read Blog
                  </Link>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Bookmarks;