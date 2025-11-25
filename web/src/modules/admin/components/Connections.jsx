import { useState } from "react";
import { UserPlusIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

export default function Connections() {
  const [activeTab, setActiveTab] = useState("connections");

  return (
    <div className="min-h-screen bg-white p-6 pb-16">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-[#2D2D2D] mb-4">Connections</h1>

      {/* Tabs */}
      <div className="flex justify-between bg-gray-100 p-2 rounded-2xl shadow-inner">
        {["connections", "suggested", "explore"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition ${
              activeTab === tab ? "text-black bg-white shadow" : "text-gray-400"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* ===================== MY CONNECTIONS ===================== */}
        {activeTab === "connections" && (
          <div className="space-y-4">
            {[1, 2, 3].map((c) => (
              <div
                key={c}
                className="flex items-center justify-between bg-white p-4 rounded-2xl shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src="/user.png"
                    className="h-12 w-12 rounded-full shadow object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-semibold">John Smith</h4>
                    <span className="text-xs text-gray-500">@johnsmith</span>
                  </div>
                </div>

                <button className="flex items-center gap-2 bg-black text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-[#1a1a1a] transition">
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Message
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ========================= SUGGESTED ========================= */}
        {activeTab === "suggested" && (
          <div className="space-y-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="flex items-center justify-between bg-white p-4 rounded-2xl shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src="/user.png"
                    className="h-12 w-12 rounded-full object-cover shadow"
                  />
                  <div>
                    <h4 className="text-sm font-semibold">Emily Rose</h4>
                    <span className="text-xs text-gray-500">Suggested for you</span>
                  </div>
                </div>

                <button className="flex items-center gap-2 bg-[#FFB300] text-black text-xs px-4 py-2 rounded-lg font-semibold shadow hover:opacity-90 transition">
                  <UserPlusIcon className="w-4 h-4" />
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ========================= EXPLORE ========================= */}
        {activeTab === "explore" && (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((e) => (
              <div
                key={e}
                className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition cursor-pointer text-center"
              >
                <img
                  src="/user.png"
                  className="h-20 w-20 rounded-full mx-auto object-cover shadow"
                />
                <h4 className="mt-3 text-sm font-semibold">Creator Name</h4>
                <p className="text-xs text-gray-500 mb-3">Artist • Designer</p>

                <button className="w-full bg-black text-white text-xs py-2 rounded-lg hover:bg-[#1a1a1a] transition">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
