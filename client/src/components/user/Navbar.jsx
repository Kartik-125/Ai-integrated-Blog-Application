import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Navbar = () => {
  const { user } = useAppContext();

  const getInitial = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-blue-600"
      >
        Daily Reads
      </Link>

      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm text-gray-500">
            Welcome
          </p>

          <p className="font-semibold text-gray-800">
            {user?.name || "User"}
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {getInitial()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;