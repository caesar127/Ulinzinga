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
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const UlinzingaYellow = "#FFB300";

function AnimatedActionButton({ icon, label }) {
  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center bg-gray-100 p-5 rounded-2xl shadow-sm hover:bg-gray-200 transition"
    >
      <div className="text-black mb-2">{icon}</div>
      <p className="text-xs font-medium">{label}</p>
    </motion.button>
  );
}

function AnimatedActivityItem({ title, subtitle, amount, positive = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-2xl hover:bg-gray-100 transition"
    >
      <div>
        <p className="font-medium text-black">{title}</p>
        <p className="text-gray-500 text-xs">{subtitle}</p>
      </div>
      <p
        className={`text-sm font-semibold ${
          positive ? "text-green-600" : "text-red-600"
        }`}
      >
        {amount}
      </p>
    </motion.div>
  );
}

export default function ProfilePage() {
  const balance = 45000;
  const [isPrivate, setIsPrivate] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className="h-screen bg-[#ffff] grid grid-cols-8 px-12">
      {/* LEFT SIDEBAR */}
      <div className="col-span-2 overflow-y-auto px-3 pt-2 h-[97vh]">
        <div className="min-h-screen bg-white pb-16">
          <h1 className="text-2xl font-bold text-[#2D2D2D] mb-4">
            Connections
          </h1>

          {/* Tabs */}
          <div className="flex text-sm font-semibold bg-white p-1 rounded-lg w-fit gap-2">
            {["connections", "suggested", "explore"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === tab
                    ? "text-black/80 bg-[#F3F3F3]"
                    : "text-[#959595]"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "connections" && (
              <div className="space-y-4">
                {[1, 2, 3].map((c) => (
                  <div
                    key={c}
                    className="flex items-center justify-between bg-white p-4 rounded-2xl shadow hover:shadow-lg transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        className="h-12 w-12 rounded-full shadow object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-semibold">John Smith</h4>
                        <span className="text-xs text-gray-500">
                          @johnsmith
                        </span>
                      </div>
                    </div>

                    <button className="flex items-center gap-2 bg-black text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-[#1a1a1a] transition">
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      Invite
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "suggested" && (
              <div className="space-y-4">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className="flex items-center justify-between bg-white p-4 rounded-2xl shadow hover:shadow-lg transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        className="h-12 w-12 rounded-full object-cover shadow"
                      />
                      <div>
                        <h4 className="text-sm font-semibold">Emily Rose</h4>
                        <span className="text-xs text-gray-500">
                          Suggested for you
                        </span>
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

            {activeTab === "explore" && (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((e) => (
                  <div
                    key={e}
                    className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition cursor-pointer text-center"
                  >
                    <img
                      src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                      className="h-20 w-20 rounded-full mx-auto object-cover shadow"
                    />
                    <h4 className="mt-3 text-sm font-semibold">Creator Name</h4>
                    <p className="text-xs text-gray-500 mb-3">
                      Classical Music lover
                    </p>

                    <button className="w-full bg-black text-white text-xs py-2 rounded-lg hover:bg-[#1a1a1a] transition">
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN WALLET/PROFILE AREA */}
      <div className="col-span-4 overflow-y-auto px-6 pt-6 h-[97vh] bg-[#F3F3F3]">
        <div className="mt-4 flex items-baseline justify-between">
          <img
            src="https://blog.photofeeler.com/wp-content/uploads/2017/02/flattering-pose-profile-pics.jpeg"
            className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
          />
          <button className="bg-black text-white text-sm px-4 py-2 ml-6 rounded-lg hover:bg-[#1a1a1a] transition">
            Edit Profile
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between w-full">
          <div>
            <h1 className="mt-4 text-xl font-[600] text-[#2D2D2D]">John Doe</h1>
            <p className="text-sm text-[#959595]">@johndoe</p>
          </div>
          <div className="bg-white flex justify-between rounded-xl p-3">
            <div className="border-r border-gray-300 px-3 text-left flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5 text-[#949494]" />
              <div>
                <h1 className="text-sm font-[600]">34</h1>
                <p className="text-xs text-[#949494]">Connects</p>
              </div>
            </div>

            <div className="border-r border-gray-300 px-3 text-left flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-[#949494]" />
              <div>
                <h1 className="text-sm font-[600]">34</h1>
                <p className="text-xs text-[#949494]">Posts</p>
              </div>
            </div>

            <div className="px-3 text-left flex items-center gap-2">
              <HeartIcon className="w-5 h-5 text-[#949494]" />
              <div>
                <h1 className="text-sm font-[600]">4</h1>
                <p className="text-xs text-[#949494]">Favourites</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex text-sm bg-white p-1 rounded-lg w-fit gap-0 overflow-hidden">
          {["posts", "events", "favourites", "settings"].map((tab, index) => {
            const isActive = activeTab === tab;
            const isLast = index === 3;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 transition ${
                  isActive ? "text-black/80 bg-[#F3F3F3] rounded-lg" : "text-[#959595]"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>

        <div className="rounded-b-3xl relative">
          {/* Tabs */}

          {/* CONTENT */}
          <div className="mt-6 w-full">
            {activeTab === "posts" && (
              <div>
                <button className="w-full bg-[#FFB300] text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow hover:opacity-90 transition">
                  <ArrowUpTrayIcon className="w-5 h-5" />
                  Upload Event Content
                </button>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-28 bg-gray-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* EVENTS */}
            {activeTab === "events" && (
              <div className="space-y-4">
                {[1, 2].map((e) => (
                  <div
                    key={e}
                    className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition"
                  >
                    <h3 className="font-semibold text-lg">Event Title</h3>
                    <p className="text-xs text-[#959595] mb-3">
                      12 Nov 2025 • 8:00 PM
                    </p>

                    <button className="bg-black text-white text-xs px-4 py-2 rounded-lg hover:bg-[#1a1a1a] transition">
                      Upload Event Content
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT WALLET SIDEBAR */}
      <div className="col-span-2 overflow-y-auto px-2 pt-2 h-[97vh]">
        <div className="min-h-screen bg-white text-black">
          {/* Wallet Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-black text-white rounded-2xl p-6 md:p-4 shadow-md mb-10"
          >
            <p className="text-gray-300 text-sm">Current Balance</p>
            <h2 className="text-xl font-semibold mt-2">
              MWK {balance.toLocaleString()}
            </h2>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="mt-6 w-full bg-[#FFB300] text-xs text-black font-semibold py-3 rounded-xl hover:bg-[#e0a200] transition"
            >
              Add Money
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
            className="grid grid-cols-2 md:grid-cols-2 gap-3 mb-12"
          >
            <AnimatedActionButton
              icon={<QrCodeIcon className="w-6 h-6" />}
              label="Scan to Pay"
            />
            <AnimatedActionButton
              icon={<UserGroupIcon className="w-6 h-6" />}
              label="Pay for a Friend"
            />
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
          <div className="space-y-6 mb-16">
            <h3 className="text-lg font-semibold">Your Event Savings</h3>
            {[1, 2].map((event) => (
              <motion.div
                key={event}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-medium text-sm text-black">
                      The Magician Album Launch
                    </p>
                    <p className="text-gray-500 text-xs">
                      Saving for Premium Ticket
                    </p>
                  </div>
                  <span className="text-xs bg-black text-white px-3 py-1 rounded-full">
                    In progress
                  </span>
                </div>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "35%" }}
                  transition={{ duration: 0.8 }}
                  className="bg-[#FFB300] h-2 rounded-full"
                ></motion.div>

                <div className="flex justify-between text-xs text-gray-500 mt-3">
                  <p>MWK 14,000 saved</p>
                  <p>Target: MWK 40,000</p>
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
          <div className="mb-20">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-5">
              <AnimatedActivityItem
                title="Ticket purchase"
                subtitle="Driemo – The Magician Album Launch"
                amount="- MWK 40,000"
              />
              <AnimatedActivityItem
                title="Saved money"
                subtitle="Event Savings"
                amount="+ MWK 5,000"
                positive
              />
              <AnimatedActivityItem
                title="Vendor Payment"
                subtitle="Food & Drinks Stall"
                amount="- MWK 5,500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
