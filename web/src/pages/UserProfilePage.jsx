import { useState } from "react";
import { Switch } from "@headlessui/react";
import {
  ArrowUpTrayIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  QrCodeIcon,
  UserGroupIcon,
  GiftIcon,
  BanknotesIcon,
  DocumentTextIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  UserIcon,
  LinkIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

// API imports
import {
  useGetCurrentUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../features/users/usersApiSlice";
import {
  useGetUserConnectionsQuery,
  useGetSuggestedConnectionsQuery,
  useGetAdvancedSuggestedConnectionsQuery,
  useSendConnectionRequestMutation,
  useGetPendingRequestsQuery,
  useGetSentRequestsQuery,
  useAcceptConnectionMutation,
  useDeclineConnectionMutation,
} from "../features/connections/connectionsApiSlice";
import {
  useGetUserWalletQuery,
  useGetWalletTransactionsQuery,
  useAddFundsToWalletMutation,
} from "../features/wallet/walletApiSlice";

const UlinzingaYellow = "#FFB300";

function AnimatedActionButton({ icon, label }) {
  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center bg-gray-100 px-2 py-3 rounded-2xl shadow-sm hover:bg-gray-200 transition"
    >
      <div className="text-black mb-2">{icon}</div>
      <p className="text-xs font-medium">{label}</p>
    </motion.button>
  );
}

function AnimatedActivityItem({ title, subtitle, amount, positive = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="flex items-center bg-gray-50 p-4 rounded-2xl shadow-sm gap-4"
    >
      {/* Icon */}
      <div className="h-10 w-10 bg-black/5 rounded-xl flex items-center justify-center shrink-0">
        <BanknotesIcon className="w-5 h-5 text-gray-700" />
      </div>

      {/* Text Section */}
      <div className="flex flex-col flex-grow min-w-0">
        <h4 className="text-sm font-semibold truncate">{title}</h4>
        <p className="text-xs text-gray-500 truncate">{subtitle}</p>
      </div>

      {/* Amount */}
      <span
        className={`text-sm font-bold whitespace-nowrap ${
          positive ? "text-green-600" : "text-red-600"
        }`}
      >
        {amount}
      </span>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { user: authUser } = useSelector((state) => state.auth);
  const {
    connections,
    suggestedConnections,
    advancedSuggestions,
    sentRequests,
  } = useSelector((state) => state.connections);
  
  // API queries
  const { data: userProfile, isLoading: isUserLoading } =
    useGetCurrentUserProfileQuery(authUser?._id);
  const { data: connectionsData, isLoading: isConnectionsLoading } =
    useGetUserConnectionsQuery();
  const { data: suggestedUsers, isLoading: isSuggestedLoading } =
    useGetSuggestedConnectionsQuery();
  const { data: pendingRequests, isLoading: isPendingLoading } =
    useGetPendingRequestsQuery();
  const { data: sentRequestsData, isLoading: isSentLoading } =
    useGetSentRequestsQuery();
  const { data: wallet, isLoading: isWalletLoading } = useGetUserWalletQuery();
  const { data: transactions, isLoading: isTransactionsLoading } =
    useGetWalletTransactionsQuery();

  // Mutations
  const [sendConnectionRequest] = useSendConnectionRequestMutation();
  const [acceptConnection] = useAcceptConnectionMutation();
  const [declineConnection] = useDeclineConnectionMutation();
  const [addFundsToWallet] = useAddFundsToWalletMutation();

  const [isPrivate, setIsPrivate] = useState(false);
  const [connectionsTab, setConnectionsTab] = useState("connections");
  const [profileTab, setProfileTab] = useState("posts");
  const [isAddingMoney, setIsAddingMoney] = useState(false);

  const balance = wallet?.balance || 0;
  const currentUser = userProfile || authUser;

  // Handler functions
  const handleConnectUser = async (targetUserId) => {
    try {
      await sendConnectionRequest({ targetUserId }).unwrap();
    } catch (error) {
      console.error("Failed to send connection request:", error);
    }
  };

  const handleAcceptRequest = async (connectionId) => {
    try {
      await acceptConnection(connectionId).unwrap();
    } catch (error) {
      console.error("Failed to accept connection request:", error);
    }
  };

  const handleDeclineRequest = async (connectionId) => {
    try {
      await declineConnection(connectionId).unwrap();
    } catch (error) {
      console.error("Failed to decline connection request:", error);
    }
  };

  const handleAddMoney = async () => {
    setIsAddingMoney(true);
    try {
      const amount = 5000;
      const description = "Added money to wallet";
      await addFundsToWallet({ amount, description }).unwrap();
    } catch (error) {
      console.error("Failed to add money:", error);
    } finally {
      setIsAddingMoney(false);
    }
  };

  return (
    <div className="h-screen bg-[#ffff] grid grid-cols-11 px-10">
      {/* LEFT SIDEBAR */}
      <div className="col-span-3 px-3 pt-2 overflow-y-auto custom-scrollbar min-h-screen pr-4">
        <div className="min-h-screen bg-white pb-4">
          <h1 className="text-xl font-[600] text-[#2D2D2D] mb-4">
            Connections
          </h1>

          {/* Tabs */}
          <div className="flex text-xs font-[500] bg-[#F7F7F7] p-1 rounded-xl gap-1 shadow-sm">
            {[
              { key: "connections", label: "Connections", icon: UserGroupIcon },
              { key: "requests", label: "Requests", icon: UserPlusIcon },
              { key: "explore", label: "Explore", icon: MagnifyingGlassIcon },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setConnectionsTab(tab.key)}
                className={`flex items-center px-4 py-3 rounded-lg transition ${
                  connectionsTab === tab.key
                    ? "text-black bg-white"
                    : "text-gray-500"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-1" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
            {/* --- CONNECTIONS LIST --- */}
            {connectionsTab === "connections" && (
              <div className="space-y-3">
                {isConnectionsLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                ) : connections && connections.length > 0 ? (
                  connections.map((connection) => (
                    <motion.div
                      key={connection._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.015 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-sm border border-gray-100 hover:shadow-lg transition"
                    >
                      {/* Profile */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={
                              connection.avatar ||
                              "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                            }
                            className="h-12 w-12 rounded-full object-cover  shadow-sm"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold">
                            {connection.name || "Unknown User"}
                          </h4>
                          <p className="text-[11px] text-gray-500">
                            @{connection.username || "username"}
                          </p>
                        </div>
                      </div>

                      {/* Action */}
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        className="flex items-center gap-1 px-4 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-xl shadow-sm hover:bg-gray-300 transition"
                        disabled
                      >
                        <LinkIcon className="w-4 h-4" />
                        Connected
                      </motion.button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    <p>No connections yet</p>
                  </div>
                )}
              </div>
            )}

            {/* --- REQUESTS LIST --- */}
            {connectionsTab === "requests" && (
              <div className="space-y-4">
                {/* Check if we have any requests (sent or received) */}
                {pendingRequests?.length > 0 || sentRequestsData?.length > 0 ? (
                  <>
                    {/* Received Requests Section */}
                    {pendingRequests && pendingRequests.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Received Requests
                        </h3>
                        {pendingRequests.map((request) => (
                          <motion.div
                            key={request._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.015 }}
                            className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition"
                          >
                            {/* Left — avatar + info */}
                            <div className="flex items-center gap-4">
                              {/* Avatar */}
                              <div className="relative">
                                <img
                                  src={
                                    request.user?.avatar ||
                                    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg"
                                  }
                                  className="h-12 w-12 rounded-full object-cover shadow"
                                />

                                {/* Pending bubble */}
                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full flex items-center justify-center shadow">
                                  <UserPlusIcon className="w-3 h-3 text-white" />
                                </div>
                              </div>

                              {/* Info */}
                              <div>
                                <h4 className="text-sm font-semibold">
                                  {request.user?.name || "Unknown User"}
                                </h4>

                                {/* Mutual connections */}
                                <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <UserGroupIcon className="w-3 h-3 text-gray-400" />
                                  {request.user?.mutualConnections || 0} mutual
                                  connections
                                </p>

                                {/* Shared interests */}
                                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                                  <SparklesIcon className="w-3 h-3 text-[#FFB300]" />
                                  {request.user?.interests &&
                                  Array.isArray(request.user.interests) &&
                                  request.user.interests.length > 0
                                    ? request.user.interests
                                        .map((i) => i.name)
                                        .join(" • ")
                                    : "Various interests"}
                                </p>
                              </div>
                            </div>

                            {/* Accept/Decline buttons */}
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.04 }}
                                onClick={() => handleAcceptRequest(request._id)}
                                className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-2 rounded-lg font-semibold shadow-sm hover:bg-green-700 transition"
                              >
                                <UserPlusIcon className="w-4 h-4" />
                                Accept
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.04 }}
                                onClick={() =>
                                  handleDeclineRequest(request._id)
                                }
                                className="flex items-center gap-1 bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded-lg font-semibold shadow-sm hover:bg-gray-300 transition"
                              >
                                Decline
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Sent Requests Section */}
                    {sentRequestsData && sentRequestsData.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Sent Requests
                        </h3>
                        {sentRequestsData.map((request) => (
                          <motion.div
                            key={request._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.015 }}
                            className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition"
                          >
                            {/* Left — avatar + info */}
                            <div className="flex items-center gap-4">
                              {/* Avatar */}
                              <div className="relative">
                                <img
                                  src={
                                    request.connection?.avatar ||
                                    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg"
                                  }
                                  className="h-12 w-12 rounded-full object-cover shadow"
                                />

                                {/* Pending bubble */}
                                <div className="absolute -bottom-1 -right-1 bg-yellow-500 w-5 h-5 rounded-full flex items-center justify-center shadow">
                                  <HeartIcon className="w-3 h-3 text-white" />
                                </div>
                              </div>

                              {/* Info */}
                              <div>
                                <h4 className="text-sm font-semibold">
                                  {request.connection?.name || "Unknown User"}
                                </h4>

                                {/* Mutual connections */}
                                <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <UserGroupIcon className="w-3 h-3 text-gray-400" />
                                  {request.connection?.mutualConnections || 0}{" "}
                                  mutual connections
                                </p>

                                {/* Shared interests */}
                                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                                  <SparklesIcon className="w-3 h-3 text-[#FFB300]" />
                                  {request.connection?.interests &&
                                  Array.isArray(request.connection.interests) &&
                                  request.connection.interests.length > 0
                                    ? request.connection.interests
                                        .map((i) => i.name)
                                        .join(" • ")
                                    : "Various interests"}
                                </p>
                              </div>
                            </div>

                            {/* Status */}
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-4 py-2 rounded-lg font-semibold shadow-sm"
                              disabled
                            >
                              Pending
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* Show suggestions if no requests exist */
                  <>
                    {isSuggestedLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                      </div>
                    ) : suggestedConnections &&
                      suggestedConnections.length > 0 ? (
                      <>
                        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Suggested Connections
                        </h3>
                        {suggestedConnections.map((user) => (
                          <motion.div
                            key={user._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.015 }}
                            className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition"
                          >
                            {/* Left — avatar + info */}
                            <div className="flex items-center gap-4">
                              {/* Avatar */}
                              <div className="relative">
                                <img
                                  src={
                                    user.avatar ||
                                    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg"
                                  }
                                  className="h-12 w-12 rounded-full object-cover shadow"
                                />

                                {/* Interest bubble */}
                                <div className="absolute -bottom-1 -right-1 bg-[#FFB300] w-5 h-5 rounded-full flex items-center justify-center shadow">
                                  <HeartIcon className="w-3 h-3 text-white" />
                                </div>
                              </div>

                              {/* Info */}
                              <div>
                                <h4 className="text-sm font-semibold">
                                  {user.name || "Unknown User"}
                                </h4>

                                {/* Mutual connections */}
                                <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <UserGroupIcon className="w-3 h-3 text-gray-400" />
                                  {user.mutualConnections || 0} mutual
                                  connections
                                </p>

                                {/* Shared interests */}
                                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                                  <SparklesIcon className="w-3 h-3 text-[#FFB300]" />
                                  {Array.isArray(user?.interests) &&
                                  user.interests.length > 0
                                    ? user.interests
                                        .map((i) => i.name)
                                        .join(" • ")
                                    : "Various interests"}
                                </p>
                              </div>
                            </div>

                            {/* Connect button */}
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              whileHover={{ scale: 1.04 }}
                              onClick={() => handleConnectUser(user._id)}
                              className="flex items-center gap-1 bg-black text-white text-xs px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-[#1a1a1a] transition"
                            >
                              <UserPlusIcon className="w-4 h-4" />
                              Connect
                            </motion.button>
                          </motion.div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center p-8 text-gray-500">
                        <p>No requests or suggestions available</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* --- EXPLORE GRID --- */}
            {connectionsTab === "explore" && (
              <div>
                {isSuggestedLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                ) : suggestedConnections && suggestedConnections.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {suggestedConnections.map((user) => (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition relative"
                      >
                        <div className="relative w-fit mx-auto">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FFB300] via-[#FFD95C] to-[#FFE9A7] p-[2px]" />

                          <img
                            src={
                              user?.avatar ||
                              "https://ui-avatars.com/api/?background=FFB300&color=fff&name=" +
                                user.name
                            }
                            className="h-20 w-20 rounded-full mx-auto object-cover relative z-10 border-4 border-white"
                          />

                          <div className="absolute inset-0 blur-lg opacity-20 bg-[#FFB300]" />
                        </div>

                        <h4 className="mt-3 text-sm font-semibold text-center">
                          {user.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 text-center">
                          {user.email}
                        </p>
                        <p className="text-[10px] text-gray-600 text-center mt-1">
                          {user.overlapCount} matching interests
                        </p>

                        <div className="flex justify-center gap-2 mt-2 flex-wrap">
                          {(user.interests || []).map((intObj, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-600"
                            >
                              {intObj?.name}
                            </span>
                          ))}
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.03 }}
                          className="w-full mt-3 bg-black text-white text-xs py-2 rounded-xl shadow hover:bg-[#1a1a1a] transition font-semibold"
                        >
                          View Profile
                        </motion.button>

                        <div className="absolute top-3 right-3">
                          <div className="bg-[#FFB300] rounded-full p-1.5 shadow">
                            <SparklesIcon className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    <p>No suggestions available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN WALLET/PROFILE AREA */}
      <div className="col-span-5 overflow-y-auto custom-scrollbar px-6 pt-6 min-h-screen bg-[#F3F3F3]">
        {/* Profile Header */}
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

        {/* Name & Stats */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-[700] text-[#2D2D2D]">
              {currentUser?.name || "Loading..."}
            </h1>
            <p className="text-sm text-[#959595]">
              @{currentUser?.username || "username"}
            </p>
          </div>

          <div className="bg-white rounded-xl flex overflow-hidden  p-3">
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
                className={`flex items-center gap-2 px-3 border-r border-gray-300 last:border-r-0 transition cursor-pointer`}
              >
                <stat.icon className="w-5 h-5 text-[#949494]" />
                <div>
                  <h1 className="text-sm font-semibold">{stat.value}</h1>
                  <p className="text-xs text-[#949494]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
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

        {/* Posts / Events Section */}
        <div className="mt-6">
          {/* POSTS */}
          {profileTab === "posts" && (
            <div className="mt-4 grid grid-cols-5 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-28 bg-gray-100 border border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition"
              >
                <ArrowUpTrayIcon className="w-6 h-6 text-[#FFB300]" />
                <p className="text-[10px] text-gray-600 mt-1">Add Post</p>
              </motion.div>

              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ rotate: 1, scale: 1.02 }}
                  className="h-28 bg-white rounded-xl shadow-xl border border-gray-300 relative"
                >
                  <div className="absolute bottom-2 left-2 text-[9px] text-gray-500">
                    Draft #{i}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* EVENTS */}
          {profileTab === "events" && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((e) => (
                <motion.div
                  key={e}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition overflow-hidden p-1"
                >
                  {/* Event Image */}
                  <img
                    src="https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                    alt={`Event ${e}`}
                    className="w-24 h-24 md:w-24 md:h-24 object-cover rounded-xl"
                  />

                  {/* Event Info */}
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-xs md:text-sm mb-1 truncate">
                        Event Title #{e}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2 truncate">
                        12 Nov 2025 • 8:00 PM
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-[#FFB300] text-black text-xs py-1.5 rounded-xl hover:bg-[#e0a200] transition shadow"
                      >
                        Upload
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-black text-white text-xs py-1.5 rounded-xl hover:bg-[#1a1a1a] transition shadow"
                      >
                        View
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT WALLET SIDEBAR */}
      <div className="col-span-3 overflow-y-auto custom-scrollbar px-4 pt-2 min-h-screen">
        <div className="min-h-screen bg-white text-black space-y-6 pb-10">
          {/* Wallet Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-black text-white rounded-2xl p-6 shadow-md overflow-hidden"
          >
            {/* tiny line graph — positioned in top-right */}
            <div className="absolute top-4 right-4 h-10 w-20 opacity-80 pointer-events-none">
              <svg viewBox="0 0 100 40" className="w-full h-full">
                <path
                  d="M5 35 L20 25 L40 28 L60 15 L80 22 L95 10"
                  className="stroke-[#FFB300] stroke-[2.5] fill-none"
                />
              </svg>
            </div>

            <p className="text-white/70 text-xs">Current Balance</p>

            <h2 className="text-xl font-semibold mt-2">
              MWK {balance.toLocaleString()}
            </h2>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddMoney}
              disabled={isAddingMoney}
              className="mt-5 w-full bg-[#FFB300] text-xs text-black font-semibold py-3 rounded-xl hover:bg-[#e0a200] transition disabled:opacity-50"
            >
              {isAddingMoney ? "Adding..." : "Add Money"}
            </motion.button>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
          >
            <AnimatedActionButton
              icon={<QrCodeIcon className="w-6 h-6" />}
              label="Scan to Pay"
            />
            {/* <AnimatedActionButton
              icon={<UserGroupIcon className="w-6 h-6" />}
              label="Pay for a Friend"
            /> */}
            <AnimatedActionButton
              icon={<GiftIcon className="w-6 h-6" />}
              label="Gift Ticket"
            />
            <AnimatedActionButton
              icon={<BanknotesIcon className="w-6 h-6" />}
              label="Event Savings"
            />
          </motion.div>

          {/* Event Savings List */}
          <div className="space-y-5">
            <h3 className="text-sm font-[500]">Your Event Savings</h3>
            {[1, 2].map((event) => (
              <motion.div
                key={event}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress"
                    className="w-12 h-12 rounded-xl object-cover"
                  />

                  <div className="flex-grow">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      The Magician Album Launch
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      Saving for Premium Ticket
                    </p>
                  </div>
                </div>

                {/* Floating progress bar */}
                <div className="relative mt-5 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "35%" }}
                    transition={{ duration: 0.8 }}
                    className="absolute left-0 top-0 h-full bg-[#FFB300] rounded-full"
                  />
                </div>

                <div className="flex justify-between mt-3 text-xs text-gray-500">
                  <span>MWK 14,000 saved</span>
                  <span>Target: MWK 40,000</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 bg-black w-full text-white py-3 rounded-xl text-xs hover:bg-black/80 transition"
                >
                  Add to Savings
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="">
            <h3 className="text-sm font-[500] mb-4">Recent Activity</h3>
            <div className="space-y-5">
              {isTransactionsLoading ? (
                <div className="flex justify-center items-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                </div>
              ) : transactions && transactions.length > 0 ? (
                transactions
                  .slice(0, 3)
                  .map((transaction) => (
                    <AnimatedActivityItem
                      key={transaction._id}
                      title={transaction.description || "Transaction"}
                      subtitle={
                        transaction.type === "credit"
                          ? "Money Added"
                          : "Money Spent"
                      }
                      amount={`${
                        transaction.type === "credit" ? "+" : "-"
                      } MWK ${transaction.amount.toLocaleString()}`}
                      positive={transaction.type === "credit"}
                    />
                  ))
              ) : (
                <div className="text-center p-4 text-gray-500">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
