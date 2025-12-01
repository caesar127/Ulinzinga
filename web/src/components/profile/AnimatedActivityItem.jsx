import { motion } from "framer-motion";
import { BanknotesIcon } from "@heroicons/react/24/solid";

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

export default AnimatedActivityItem;