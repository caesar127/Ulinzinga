import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import arrowicon from "../assets/icons/arrowicon.svg";
import { setSelectedEvent } from "../features/events/eventsSlice";
import { useDispatch } from "react-redux";

function EventCard({ event }) {
  const dispatch = useDispatch();
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    hover: { scale: 1.03 },
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      key={event._id}
      className="rounded-lg p-1 relative group"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      
      <div className="absolute top-6 left-6 bg-white px-3 py-2 rounded-xl shadow-md text-center z-10">
        <span className="block text-base font-semibold">
          {new Date(event.start_date).getDate()}
        </span>
        <span className="block text-xs uppercase">
          {new Date(event.start_date).toLocaleDateString(undefined, {
            month: "short",
          })}
        </span>
      </div>
      
      <motion.img
        src={event.banner_url}
        className="h-80 rounded-2xl object-cover w-full bg-black"
        alt={event.title}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.6 }}
      />
      
      <div className="flex justify-between items-center mt-5">
        <div className="flex items-center space-x-2">
          <motion.img
            src={event.logo_url || event.banner_url}
            alt={event.title}
            className="h-12 w-12 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="text-xs">
            <h2 className="font-medium truncate w-24" title={event.title}>
              {event.title}
            </h2>
            <p className="text-xs text-gray-500">{event.venue?.name}</p>
          </div>
        </div>

        <div className="flex items-center">
          <span className="text-[#ACACAC] text-2xl font-[200]">|</span>
          <motion.div whileHover="hover" whileTap="tap">
            <Link
              to={`/eventdetails`}
              onClick={() => {
                dispatch(setSelectedEvent(event));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-black text-white rounded-full flex items-center space-x-2 px-2 py-2 text-xs ml-2"
            >
              <img src={arrowicon} alt="arrow" className="h-7 w-7" />
              <span className="pr-3 text-base">Buy</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default EventCard;
