import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UserGroupIcon,
  DocumentTextIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  CameraIcon,
} from "@heroicons/react/24/solid";
import { useLogoutMutation } from "../../features/auth/authApiSlice";
import { logout as logoutAction } from "../../features/auth/authSlice";
import { useUploadProfilePictureMutation } from "../../features/users/usersApiSlice";
import EditProfileModal from "./EditProfileModal";

export function ProfileHeader({
  currentUser,
  connections,
  profileTab,
  setProfileTab,
  onProfileUpdate,
}) {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [uploadProfilePicture, { isLoading: isUploading }] = useUploadProfilePictureMutation();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);

  // Get the name for initial display
  const userName = currentUser?.profile?.name || currentUser?.name || authUser?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const userPicture = currentUser?.profile?.picture || currentUser?.picture;

  const handleEditProfile = () => {
    setShowEditModal(true);
    setShowDropdown(false);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logoutAction());
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("picture", file);
      
      await uploadProfilePicture(formData).unwrap();
      
      // Trigger profile update callback if provided
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      alert("Failed to upload profile picture. Please try again.");
    }
    
    // Reset file input
    e.target.value = "";
  };

  return (
    <>
      <div className="mt-4 flex items-end justify-between relative">
        <div className="relative">
          <div className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-xl overflow-hidden bg-gray-200 flex items-center justify-center">
            {userPicture ? (
              <img
                src={userPicture}
                alt={userName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-gray-500">
                {userInitials}
              </span>
            )}
          </div>
          
          {/* Camera Button */}
          <button
            onClick={handleCameraClick}
            disabled={isUploading}
            className="absolute bottom-0 right-0 w-10 h-10 bg-black text-white rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:bg-[#1a1a1a] transition disabled:opacity-50"
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CameraIcon className="w-5 h-5" />
            )}
          </button>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {/* <span className="absolute bottom-2 right-14 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></span> */}
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleEditProfile}
            className="bg-black text-white text-sm px-5 py-2 ml-6 rounded-lg shadow-lg hover:bg-[#1a1a1a] transition"
          >
            Edit Profile
          </motion.button>

          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-gray-100 text-gray-700 p-2 rounded-lg shadow-lg hover:bg-gray-200 transition"
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </motion.button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                <button
                  onClick={handleEditProfile}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(false)}
        />
      )}

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentUser={currentUser}
        onProfileUpdate={onProfileUpdate}
      />
    </>
  );
}

export function ProfileStats({ currentUser, connections }) {
  return (
    <div className="bg-white rounded-xl flex overflow-hidden p-3">
      {[
        {
          icon: UserGroupIcon,
          label: "Connects",
          value: connections?.length || 0,
        },
        {
          icon: DocumentTextIcon,
          label: "Posts",
          value: currentUser?.postsCount || 0,
        },
        {
          icon: HeartIcon,
          label: "Favourites",
          value: currentUser?.favoriteEvents?.length || 0,
        },
      ].map((stat, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-3 border-r border-gray-300 last:border-r-0 transition cursor-pointer"
        >
          <stat.icon className="w-5 h-5 text-[#949494]" />
          <div>
            <h1 className="text-sm font-semibold">{stat.value}</h1>
            <p className="text-xs text-[#949494]">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfileTabs({ profileTab, setProfileTab }) {
  return (
    <div className="mt-8 flex text-sm font-[500] bg-white p-1 rounded-lg w-fit overflow-hidden shadow-sm">
      {["content", "events", "favourites"].map((tab) => {
        const isActive = profileTab === tab;
        return (
          <motion.button
            key={tab}
            onClick={() => setProfileTab(tab)}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 transition rounded-lg ${
              isActive ? "bg-gray-100 text-black" : "text-gray-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        );
      })}
    </div>
  );
}
