import React from "react";

const BlogStatusBadge = ({ isPublished }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        isPublished
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {isPublished ? "Published" : "Pending Review"}
    </span>
  );
};

export default BlogStatusBadge;