import React from "react";
import { Link } from "react-router-dom";
import { LuFilePlus2 } from "react-icons/lu";

const EmptyDashboard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 mt-8">

      <div className="flex flex-col items-center justify-center text-center">

        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
          <LuFilePlus2
            size={40}
            className="text-blue-600"
          />
        </div>

        <h2 className="mt-6 text-2xl font-semibold text-gray-800">
          No Blogs Yet
        </h2>

        <p className="mt-3 max-w-md text-gray-500">
          You haven't written any blogs yet.
          Start sharing your ideas and knowledge with the Daily Reads community.
        </p>

        <Link
          to="/dashboard/create-blog"
          className="mt-8 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Create Your First Blog
        </Link>

      </div>

    </div>
  );
};

export default EmptyDashboard;