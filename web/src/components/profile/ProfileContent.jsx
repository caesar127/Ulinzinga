import { motion } from "framer-motion";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";

export function PostsTab() {
  return (
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
  );
}

export function EventsTab() {
  return (
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
  );
}