import React from "react";

const BlogStatusBadge = ({ status }) => {
  const config = {
    approved: {
      text: "Approved",
      className: "bg-green-100 text-green-700",
    },
    pending: {
      text: "Pending Review",
      className: "bg-yellow-100 text-yellow-700",
    },
    rejected: {
      text: "Rejected",
      className: "bg-red-100 text-red-700",
    },
  };

  const current = config[status] || config.pending;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${current.className}`}
    >
      {current.text}
    </span>
  );
};

export default BlogStatusBadge;