import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const Profile = () => {
  const { axios, userToken, user, setUser } = useAppContext();

  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchProfile();
    }
  }, [userToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          My Profile
        </h1>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-500 mb-1">Name</p>
            <p className="text-gray-800 font-medium">
              {user?.name || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="text-gray-800 font-medium">
              {user?.email || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;