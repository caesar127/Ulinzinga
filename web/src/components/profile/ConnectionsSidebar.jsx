import { motion } from "framer-motion";
import {
  UserPlusIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  SparklesIcon,
  LinkIcon,
  XMarkIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/solid";

export default function ConnectionsSidebar({
  connectionsTab,
  setConnectionsTab,
  isConnectionsLoading,
  connections,
  isPendingLoading,
  pendingRequests,
  isSentLoading,
  sentRequestsData,
  isSuggestedLoading,
  suggestedConnections,
  handleConnectUser,
  handleAcceptRequest,
  handleDeclineRequest,
}) {
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };
  return (
    <div className="min-h-screen bg-white pb-4">
      <h1 className="text-xl font-[600] text-[#2D2D2D] mb-4">Connections</h1>
      
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

      <div className="mt-6 flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden p-2">
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
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {connection.avatar ? (
                        <img
                          src={connection.avatar}
                          className="h-12 w-12 rounded-full object-cover shadow-sm"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center shadow-sm">
                          <span className="text-sm font-semibold text-gray-600">
                            {getInitials(connection.name)}
                          </span>
                        </div>
                      )}
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
                  
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    className="flex items-center gap-1 px-4 py-1.5 text-xs bg-black text-white rounded-xl shadow-sm transition"
                    disabled
                  >
                    <LinkIcon className="w-4 h-4" />
                    Link up
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
        
        {connectionsTab === "requests" && (
          <div className="space-y-4">
            {pendingRequests?.length > 0 || sentRequestsData?.length > 0 ? (
              <>
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
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="relative">
                            {request.user?.avatar ? (
                              <img
                                src={request.user.avatar}
                                className="h-12 w-12 rounded-full object-cover shadow"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center shadow">
                                <span className="text-sm font-semibold text-gray-600">
                                  {getInitials(request.user?.name)}
                                </span>
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full flex items-center justify-center shadow">
                              <UserPlusIcon className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">
                              {request.user?.name || "Unknown User"}
                            </h4>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                              <UserGroupIcon className="w-3 h-3 text-gray-400" />
                              {request.user?.mutualConnections || 0} mutual
                              connections
                            </p>
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
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.04 }}
                            onClick={() => handleDeclineRequest(request._id)}
                            className="flex items-center gap-1 bg-gray-200 text-gray-700 text-xs p-2 rounded-full font-semibold shadow-sm hover:bg-gray-300 transition flex-shrink-0"
                          >
                            <NoSymbolIcon className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.04 }}
                            onClick={() => handleAcceptRequest(request._id)}
                            className="flex items-center gap-1 bg-green-600 text-white text-xs p-2 rounded-full font-semibold shadow-sm hover:bg-green-700 transition flex-shrink-0"
                          >
                            <UserPlusIcon className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
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
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {request.connection?.avatar ? (
                              <img
                                src={request.connection.avatar}
                                className="h-12 w-12 rounded-full object-cover shadow"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center shadow">
                                <span className="text-sm font-semibold text-gray-600">
                                  {getInitials(request.connection?.name)}
                                </span>
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 bg-yellow-500 w-5 h-5 rounded-full flex items-center justify-center shadow">
                              <HeartIcon className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">
                              {request.connection?.name || "Unknown User"}
                            </h4>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                              <UserGroupIcon className="w-3 h-3 text-gray-400" />
                              {request.connection?.mutualConnections || 0}{" "}
                              mutual connections
                            </p>
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
              <>
                {isSuggestedLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                ) : suggestedConnections && suggestedConnections.length > 0 ? (
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
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                className="h-12 w-12 rounded-full object-cover shadow"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center shadow">
                                <span className="text-sm font-semibold text-gray-600">
                                  {getInitials(user.name)}
                                </span>
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 bg-[#FFB300] w-5 h-5 rounded-full flex items-center justify-center shadow">
                              <HeartIcon className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">
                              {user.name || "Unknown User"}
                            </h4>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                              <UserGroupIcon className="w-3 h-3 text-gray-400" />
                              {user.mutualConnections || 0} mutual connections
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                              <SparklesIcon className="w-3 h-3 text-[#FFB300]" />
                              {Array.isArray(user?.interests) &&
                              user.interests.length > 0
                                ? user.interests.map((i) => i.name).join(" • ")
                                : "Various interests"}
                            </p>
                          </div>
                        </div>
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
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          className="h-20 w-20 rounded-full mx-auto object-cover relative z-10 border-4 border-white"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center relative z-10 border-4 border-white">
                          <span className="text-lg font-semibold text-gray-600">
                            {getInitials(user.name)}
                          </span>
                        </div>
                      )}
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
  );
}
