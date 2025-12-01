import { motion } from "framer-motion";
import {
  UserGroupIcon,
  DocumentTextIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";

export function ProfileHeader({
  currentUser,
  connections,
  profileTab,
  setProfileTab,
}) {
  return (
    <div className="mt-4 flex items-end justify-between relative">
      <div className="relative">
        <img
          src="https://blog.photofeeler.com/wp-content/uploads/2017/02/flattering-pose-profile-pics.jpeg"
          className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-xl"
        />
        <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        className="bg-black text-white text-sm px-5 py-2 ml-6 rounded-lg shadow-lg hover:bg-[#1a1a1a] transition"
      >
        Edit Profile
      </motion.button>
    </div>
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
      {["posts", "events", "favourites", "settings"].map((tab) => {
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