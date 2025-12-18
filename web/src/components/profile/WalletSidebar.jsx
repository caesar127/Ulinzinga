import { motion } from "framer-motion";
import {
  BanknotesIcon,
  QrCodeIcon,
  GiftIcon,
  ArrowUpTrayIcon,
  UserGroupIcon,
  DocumentTextIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import AnimatedActionButton from "./AnimatedActionButton";
import AnimatedActivityItem from "./AnimatedActivityItem";
import { useGetEventByIdQuery } from "../../features/events/eventsApiSlice";

export default function WalletSidebar({
  balance,
  totalSavings,
  isAddingMoney,
  handleAddMoney,
  handleCreateSavingsGoal,
  isCreatingGoal,
  savingsGoals,
  isAddingToSavings,
  handleAddToSavings,
  refetchSavingsGoals,
  isTransactionsLoading,
  transactions,
  handleGiftTicket,
}) {
  return (
    <div className="min-h-screen bg-white text-black space-y-6 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-black text-white rounded-2xl p-6 shadow-md overflow-hidden"
      >
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
        <AnimatedActionButton
          icon={<GiftIcon className="w-6 h-6" />}
          label="Gift Ticket"
          onClick={handleGiftTicket}
        />
        <AnimatedActionButton
          icon={<BanknotesIcon className="w-6 h-6" />}
          label="Event Savings"
        />
      </motion.div>
      
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-[500]">Your Event Savings</h3>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCreateSavingsGoal}
            disabled={isCreatingGoal}
            className="text-xs bg-[#FFB300] text-black px-3 py-1 rounded-lg hover:bg-[#e0a200] transition disabled:opacity-50"
          >
            {isCreatingGoal ? "Creating..." : "+ Create Goal"}
          </motion.button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {savingsGoals && savingsGoals.length > 0 ? (
            savingsGoals.map((goal) => {
              const progressPercentage =
                (goal.currentAmount / goal.targetAmount) * 100;
              const isCompleted = goal.isCompleted;

              const { data: event } = useGetEventByIdQuery(goal?.event_slug, {
                skip: !goal?.event_slug,
              });

              return (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 w-fit min-w-xs flex-shrink-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={event?.banner_url}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-grow">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {goal.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {isCompleted
                          ? "Goal Completed!"
                          : goal.description || "Saving for your goal"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative mt-5 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(progressPercentage, 100)}%`,
                      }}
                      transition={{ duration: 0.8 }}
                      className={`absolute left-0 top-0 h-full rounded-full ${
                        isCompleted ? "bg-green-500" : "bg-[#FFB300]"
                      }`}
                    />
                  </div>

                  <div className="flex justify-between mt-3 text-xs text-gray-500">
                    <span>MWK {goal.currentAmount.toLocaleString()} saved</span>
                    <span>
                      Target: MWK {goal.targetAmount.toLocaleString()}
                    </span>
                  </div>

                  {!isCompleted && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAddToSavings(goal._id, goal.name)}
                      disabled={isAddingToSavings[goal._id]}
                      className="mt-4 bg-black w-full text-white py-3 rounded-xl text-xs hover:bg-black/80 transition disabled:opacity-50"
                    >
                      {isAddingToSavings[goal._id]
                        ? "Adding..."
                        : "Add to Savings"}
                    </motion.button>
                  )}

                  {isCompleted && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="mt-4 bg-green-500 w-full text-white py-3 rounded-xl text-xs hover:bg-green-600 transition"
                      disabled
                    >
                      Goal Achieved!
                    </motion.button>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="text-center p-8 text-gray-500">
              <p className="text-sm">No savings goals yet</p>
              <p className="text-xs mt-1">
                Create your first goal to start saving!
              </p>
            </div>
          )}
        </div>
        {/* Show total savings if available */}
        {/* {totalSavings > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 mt-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Savings</p>
              <p className="text-lg font-bold text-gray-900">
                MWK {totalSavings.toLocaleString()}
              </p>
            </div>
          </div>
        )} */}
      </div>
      
      <div>
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
  );
}
