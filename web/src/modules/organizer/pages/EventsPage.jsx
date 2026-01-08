import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  setSelectedEvent,
  clearEvents,
} from "@/features/organizer-events/organizerEventsSlice";
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import arrowicon from "@/assets/icons/arrowicon.svg";
import { useGetOrganizerEventsQuery } from "@/features/organizer-events/organizerEventsApiSlice";
import CreateEventModal from "../components/CreateEventModal";
import { useLazyGetOrganizerEventsQuery } from "../../../features/organizer-events/organizerEventsApiSlice";

function EventsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { events } = useSelector((state) => state.organizerEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [openMenu, setOpenMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  const [getEvents, { data, isLoading, error }] =
    useLazyGetOrganizerEventsQuery();

  const fetchEvents = () => {
    getEvents({
      page: currentPage,
      limit: pageLimit,
      sortBy: "created_at",
      sortOrder: "desc",
      merchantId: user.profile.business.reference,
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  console.log(data);

  // 🔎 Filter events
  useEffect(() => {
    if (events?.length > 0) {
      const term = searchTerm.toLowerCase();

      const filtered = events.filter(
        (event) =>
          event.title?.toLowerCase().includes(term) ||
          event.venue_name?.toLowerCase().includes(term) ||
          event.description?.toLowerCase().includes(term) ||
          event.location?.toLowerCase().includes(term)
      );

      setFilteredEvents(filtered);
    } else {
      setFilteredEvents([]);
    }
  }, [events, searchTerm]);

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle limit changes
  const handleLimitChange = (newLimit) => {
    setPageLimit(newLimit);
    setCurrentPage(1);
  };

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

  const paginatedEvents = filteredEvents;
  const pagination = events?.pagination;

  const handleCreateEvent = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="h-full bg-[#F7F8F9] p-6">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="mb-3">
            <h1 className="text-xl font-[600]">My Events</h1>
            <p className="mt-1 text-sm text-[#7B7B7B]">
              Create and manage your events
            </p>
          </div>
          <button
            onClick={handleCreateEvent}
            className="px-4 py-2 bg-[#FFB300] text-sm text-white rounded-xl hover:bg-gray-800 flex items-center gap-2"
          >
            Create Event
            <img src={arrowicon} alt="arrow" className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
            <input
              type="text"
              placeholder="Search your events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 px-4 py-2 border border-black/10 rounded-lg focus:outline-none"
            />

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                Filter by date
              </button>
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A]">
                  Event Name
                </th>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A]">
                  Venue
                </th>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A]">
                  Date
                </th>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A]">
                  Status
                </th>
                <th className="px-2 py-3 text-sm font-semibold text-[#8B909A] text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedEvents.map((event, idx) => (
                <tr key={event.id || idx} className="hover:bg-gray-50">
                  <td className="px-2 py-1 text-sm font-medium">
                    {event.title}
                  </td>
                  <td className="px-2 py-1 text-sm">
                    <div>
                      <div className="font-medium">{event.venue_name}</div>
                      <div className="text-xs text-gray-500">
                        {event.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-1 text-sm">
                    {event.end_date
                      ? formatDateRange(event.start_date, event.end_date)
                      : formatDate(event.start_date)}
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
                          <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg z-50">
                            <Link
                              to={`/organizer/event/`}
                              onClick={() =>
                                dispatch(setSelectedEvent(event))
                              }
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-xl"
                            >
                              <CogIcon className="h-4 w-4" />
                              Manage
                            </Link>

                            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                              <PencilIcon className="h-4 w-4" />
                              Edit
                            </button>

                            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl">
                              <TrashIcon className="h-4 w-4" />
                              Delete
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
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    {isLoading ? "Loading events..." : "No events found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalCount
                )}{" "}
                of {pagination.totalCount} results
              </div>

              <div className="flex items-center gap-2">
                {/* Limit selector */}
                <select
                  value={pageLimit}
                  onChange={(e) => handleLimitChange(e.target.value)}
                  className="px-3 py-1 text-sm border rounded-lg"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>

                <button
                  className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                  Prev
                </button>

                <span className="text-sm text-gray-700 px-2">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default EventsPage;
