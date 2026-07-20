import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

import { IoChevronDown } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineArticle } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { BsBookmark } from "react-icons/bs";

const Navbar = () => {

  const {
    adminToken,
    userToken,
    user,
    logoutUser,
  } = useAppContext();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
        <img onClick={()=>navigate('/')} src={assets.logo} alt="logo" className='w-32 sm:w-44 cursor-pointer' />
        <div className="relative" ref={dropdownRef}>
          {adminToken ? (
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 rounded-full bg-primary text-white px-6 py-2.5"
            >
              Admin Panel
              <img src={assets.arrow} alt="" className="w-3" />
            </button>
          ) : userToken ? (
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <span className="hidden sm:block font-medium">
                {user?.name}
              </span>

              <IoChevronDown
                className={`transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 rounded-full bg-primary text-white px-8 py-2.5"
            >
              Login
              <img src={assets.arrow} alt="" className="w-3" />
            </button>
          )}

          {open && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border overflow-hidden z-50">

              <button
                className="w-full text-left px-5 py-3 hover:bg-gray-100"
              >
                My Profile
              </button>

              <button
                className="w-full text-left px-5 py-3 hover:bg-gray-100"
              >
                My Blogs
              </button>

              <button
                className="w-full text-left px-5 py-3 hover:bg-gray-100"
              >
                Bookmarks
              </button>

              <hr />

              <button
                onClick={() => {
                  logoutUser();
                  navigate("/");
                }}
                className="w-full text-left px-5 py-3 text-red-500 hover:bg-red-50"
              >
                Logout
              </button>

            </div>
          )}
        </div>
      
    </div>
  )
}

export default Navbar
