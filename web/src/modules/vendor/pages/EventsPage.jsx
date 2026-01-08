import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedEvent,
  clearVendorEvents,
} from "@/features/vendor-events/vendorEventsSlice";
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisVerticalIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useGetAvailableEventsQuery } from "@/features/vendor-events/vendorEventsApiSlice";

function VendorEventsPage() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const {
    data: eventsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAvailableEventsQuery();

  const { availableEvents } = useSelector((state) => state.vendorEvents);

  const events = availableEvents;

  // 🔎 Filter events
  useEffect(() => {
    if (events?.length > 0) {
      const term = searchTerm.toLowerCase();

      const filtered = events.filter(
        (event) =>
          event.title?.toLowerCase().includes(term) ||
          event.venue_name?.toLowerCase().includes(term) ||
          event.organizer?.toLowerCase().includes(term) ||
          event.location?.toLowerCase().includes(term)
      );

      setFilteredEvents(filtered);
      setCurrentPage(1);
    }
  }, [events, searchTerm]);

  useEffect(() => {
    return () => dispatch(clearVendorEvents());
  }, [dispatch]);

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return formatDate(startDate);
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };
    
  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="h-full bg-[#F7F8F9] p-6">
      <div className="max-w-full mx-auto">
        <div className="mb-3">
          <h1 className="text-xl font-[600]">Available Events</h1>
          <p className="mt-1 text-sm text-[#7B7B7B]">
            Browse and manage events where you can sell your products
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 px-4 py-2 border border-black/10 rounded-lg focus:outline-none"
            />

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                Filter by date
              </button>
              
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                Filter by organizer
              </button>
            </div>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A]">Organizer</th>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A]">Event Name</th>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A]">Venue</th>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A]">Date</th>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A]">Status</th>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A] text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedEvents.map((event, idx) => (
                <tr key={event.id || idx} className="hover:bg-gray-50">
                  <td className="px-2 py-1 text-sm">{event.organizer}</td>
                  <td className="px-2 py-1 text-sm font-medium">{event.title}</td>
                  <td className="px-2 py-1 text-sm">
                    <div>
                      <div className="font-medium">{event.venue_name}</div>
                      <div className="text-xs text-gray-500">{event.location}</div>
                    </div>
                  </td>
                  <td className="px-2 py-1 text-sm">
                    {event.end_date 
                      ? formatDateRange(event.start_date, event.end_date)
                      : formatDate(event.start_date)
                    }
                  </td>

                  <td className="px-2 py-1">
                    <span
                      className={`px-3 py-1 text-xs rounded-lg ${
                        event.status === "Past"
                          ? "bg-gray-200 text-gray-700"
                          : event.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {event.isActive
                        ? "Active"
                        : event.status === "Past"
                        ? "Past"
                        : "Upcoming"}
                    </span>
                  </td>

                  <td className="px-2 py-1 text-right relative">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        {event.isVisible ? (
                          <EyeIcon className="h-5 w-5 text-gray-700" />
                        ) : (
                          <EyeSlashIcon className="h-5 w-5 text-gray-700" />
                        )}
                      </button>

                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        {event.isActive ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500" />
                        )}
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => toggleMenu(idx)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5 text-gray-700" />
                        </button>

                        {openMenu === idx && (
                          <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border z-50">
                            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                              <EyeIcon className="h-4 w-4" />
                              View Details
                            </button>

                            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                              <PlusIcon className="h-4 w-4" />
                              Apply as Vendor
                            </button>

                            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                              <CheckCircleIcon className="h-4 w-4" />
                              Join Event
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedEvents.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500 text-sm">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {filteredEvents.length > PAGE_SIZE && (
            <div className="flex items-center justify-end mt-6 gap-2">
              <button
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </button>

              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorEventsPage;