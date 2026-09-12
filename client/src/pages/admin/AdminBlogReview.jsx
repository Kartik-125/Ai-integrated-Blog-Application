import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const AdminBlogReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { axios, adminToken } = useAppContext();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [aiReview, setAiReview] = useState(null);
  const [runningAI, setRunningAI] = useState(false);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`/admin/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (data.success) {
        setBlog(data.blog);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && adminToken) {
      fetchBlog();
    }
  }, [id, adminToken]);

  const runAICheck = async () => {
    setRunningAI(true);
    setAiReview(null);

    try {
      const { data } = await axios.post(
        "/ai/review-blog",
        {
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          category: blog.category,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (data.success) {
        setAiReview(data.review);

        if (
          data.review.verdict === "flag" &&
          data.review.issues?.length > 0
        ) {
          setReason(data.review.issues.map((issue) => `- ${issue}`).join("\n"));
          setRejecting(true);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to run AI check"
      );
    } finally {
      setRunningAI(false);
    }
  };

  const approveBlog = async () => {
    try {
      const { data } = await axios.post(
        "/admin/approve-blog",
        {
          id: blog._id,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);

        setBlog((prev) => ({
          ...prev,
          status: "approved",
          rejectionReason: "",
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve blog");
    }
  };

  const rejectBlog = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      const { data } = await axios.post(
        "/admin/reject-blog",
        {
          id: blog._id,
          reason: reason.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);

        setBlog((prev) => ({
          ...prev,
          status: "rejected",
          rejectionReason: reason.trim(),
        }));

        setRejecting(false);
        setReason("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject blog");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Blog not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-full overflow-auto p-5 sm:p-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Review Blog
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Read the complete blog before making a decision.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/manage-blogs")}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-white"
        >
          Back
        </button>
      </div>

      {/* Blog */}
      <div className="bg-white max-w-4xl mx-auto rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Image */}
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full max-h-[400px] object-cover"
        />

        <div className="p-6 sm:p-10">

          {/* Status */}
          <div className="flex items-center justify-between mb-5">

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                blog.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : blog.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {blog.status === "approved"
                ? "Approved"
                : blog.status === "rejected"
                ? "Rejected"
                : "Pending Review"}
            </span>

            <span className="text-sm text-gray-500">
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>

          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            {blog.title}
          </h1>

          {/* Excerpt */}
          <p className="text-gray-500 mt-4 text-lg">
            {blog.excerpt}
          </p>

          {/* Author */}
          <div className="mt-5 text-sm text-gray-500">
            <span className="font-medium text-gray-700">
              Author:
            </span>{" "}
            {blog.author?.name || "Unknown"}
          </div>

          {/* Category */}
          <div className="mt-2 text-sm text-gray-500">
            <span className="font-medium text-gray-700">
              Category:
            </span>{" "}
            {blog.category}
          </div>

          <hr className="my-8" />

          {/* Content */}
          <div
            className="rich-text"
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          />

          {/* Previous rejection reason */}
          {blog.status === "rejected" && blog.rejectionReason && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-semibold text-red-700">
                Rejection Reason
              </p>

              <p className="text-sm text-red-600 mt-1">
                {blog.rejectionReason}
              </p>
            </div>
          )}

          {/* AI Pre-check */}
          {blog.status === "pending" && (
            <div className="mt-10 pt-6 border-t">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-gray-700">AI pre-check</p>

                <button
                  onClick={runAICheck}
                  disabled={runningAI}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {runningAI ? "Checking..." : "Run AI Check"}
                </button>
              </div>

              {aiReview && (
                <div
                  className={`p-4 rounded-lg border ${
                    aiReview.verdict === "flag"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <p
                    className={`font-semibold ${
                      aiReview.verdict === "flag"
                        ? "text-yellow-700"
                        : "text-green-700"
                    }`}
                  >
                    {aiReview.verdict === "flag"
                      ? "Possible issues found"
                      : "No issues found"}
                  </p>

                  {aiReview.issues?.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                      {aiReview.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  )}

                  {aiReview.reasoning && (
                    <p className="text-sm text-gray-500 mt-2">
                      {aiReview.reasoning}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-3">
                    This is a suggestion, not a decision — you still choose whether to approve or reject.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Admin Actions */}
          {blog.status === "pending" && (
            <div className="mt-10 pt-6 border-t">

              {!rejecting ? (
                <div className="flex gap-4">

                  <button
                    onClick={approveBlog}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve Blog
                  </button>

                  <button
                    onClick={() => setRejecting(true)}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject Blog
                  </button>

                </div>
              ) : (
                <div>

                  <p className="font-medium text-gray-700 mb-2">
                    Why are you rejecting this blog?
                  </p>

                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary min-h-[120px]"
                  />

                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={rejectBlog}
                      className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Confirm Rejection
                    </button>

                    <button
                      onClick={() => {
                        setRejecting(false);
                        setReason("");
                      }}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminBlogReview;