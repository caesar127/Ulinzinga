import React from "react";
import { ArrowRight, Wallet, QrCode, Gift, Users } from "lucide-react";
import { motion } from "framer-motion";

function WalletPage() {
  const balance = 45000;

  return (
    <div className="min-h-screen bg-white text-black px-5 py-6 md:px-12">

      {/* Wallet Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black text-white rounded-3xl p-6 md:p-8 shadow-md mb-10"
      >
        <p className="text-gray-300 text-sm">Current Balance</p>
        <h2 className="text-4xl font-[600] mt-2">
          MWK {balance.toLocaleString()}
        </h2>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="mt-6 w-full bg-[#FFB300] text-black font-semibold py-3 rounded-xl hover:bg-[#e0a200] transition"
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
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12"
      >
        <AnimatedActionButton icon={<QrCode className="w-6 h-6" />} label="Scan to Pay" />
        <AnimatedActionButton icon={<Users className="w-6 h-6" />} label="Pay for a Friend" />
        <AnimatedActionButton icon={<Gift className="w-6 h-6" />} label="Gift Ticket" />
        <AnimatedActionButton icon={<Wallet className="w-6 h-6" />} label="Event Savings" />
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
                <p className="font-medium text-black">
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

            {/* Progress Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "35%" }}
              transition={{ duration: 0.8 }}
              className="bg-[#FFB300] h-2 rounded-full"
            ></motion.div>

            <div className="flex justify-between text-sm text-gray-500 mt-3">
              <p>MWK 14,000 saved</p>
              <p>Target: MWK 40,000</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="mt-4 bg-black w-full text-white py-3 rounded-xl text-sm hover:bg-black/80 transition"
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
  );
}

/* COMPONENTS */

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

export default WalletPage;
