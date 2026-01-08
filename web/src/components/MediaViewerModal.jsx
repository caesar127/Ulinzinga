import { useState } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

export default function MediaViewerModal({ open, onClose, media }) {
  const [index, setIndex] = useState(0);

  if (!open) return null;

  const prev = () => setIndex((i) => (i === 0 ? media.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === media.length - 1 ? 0 : i + 1));

  const current = media[index];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>

        {/* Left */}
        {media.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-4 text-white"
          >
            <ChevronLeftIcon className="w-8 h-8" />
          </button>
        )}

        {/* Media */}
        <motion.div
          key={index}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-[90vw] max-h-[85vh]"
        >
          {current.type === "video" ? (
            <video
              src={current.url}
              controls
              autoPlay
              className="max-h-[85vh] rounded-xl"
            />
          ) : (
            <img
              src={current.url}
              alt=""
              className="max-h-[85vh] rounded-xl object-contain"
            />
          )}
        </motion.div>

        {/* Right */}
        {media.length > 1 && (
          <button
            onClick={next}
            className="absolute right-4 text-white"
          >
            <ChevronRightIcon className="w-8 h-8" />
          </button>
        )}

        {/* Dots */}
        {media.length > 1 && (
          <div className="absolute bottom-6 flex gap-2">
            {media.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === index ? "bg-white" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
