import React from "react";
import { Link } from "react-router-dom";
import arrowicon from "../assets/icons/arrowicon.svg";
import placeholderImage from "../assets/Nostalgia-Brunch-124.webp";
import { setSelectedEvent } from "../features/events/eventsSlice";
import { useDispatch } from "react-redux";

function EventCard({ event }) {
  const dispatch = useDispatch();
  return (
    <div key={event._id} className="rounded-lg p-1 relative group">
      {/* Date badge */}
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

      {/* Event banner */}
      <img
        src={event.banner_url || placeholderImage}
        className="h-80 rounded-2xl object-cover w-full bg-black"
        alt={event.title}
      />

      {/* Info Section */}
      <div className="flex justify-between items-center mt-5">
        <div className="flex items-center space-x-2">
          <img
            src={event.logo_url || event.banner_url}
            alt={event.title}
            className="h-12 w-12 rounded-full"
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
          <Link
            to="/eventdetails"
            onClick={() => dispatch(setSelectedEvent(event))}
            className="bg-black text-white rounded-full flex items-center space-x-2 px-2 py-2 text-xs ml-2"
          >
            <img src={arrowicon} alt="arrow" className="h-7 w-7" />
            <span className="pr-3 text-base">Buy</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
