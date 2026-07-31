import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuSquarePen,
  LuBookOpen,
  LuUser,
  LuLogOut,
} from "react-icons/lu";

import { useAppContext } from "../../context/AppContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAppContext();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LuLayoutDashboard,
    },
    {
      name: "Create Blog",
      path: "/dashboard/create-blog",
      icon: LuSquarePen,
    },
    {
      name: "My Blogs",
      path: "/dashboard/my-blogs",
      icon: LuBookOpen,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: LuUser,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col justify-between">
      <div className="p-5">
        <h2 className="text-xl font-bold mb-8">
          User Panel
        </h2>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={20} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-5 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <LuLogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;