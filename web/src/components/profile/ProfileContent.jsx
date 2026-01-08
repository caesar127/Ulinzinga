import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpTrayIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useGetUserPurchasedEventsQuery } from "../../features/user-events/userEventsApiSlice";
import { useGetUserContentQuery } from "../../features/content/contentApiSlice";
import GalleryUploaderModal from "../GalleryUploaderModal";
import { useSelector } from "react-redux";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import MediaViewerModal from "../MediaViewerModal";

export function ContentTab({ currentUser }) {
  const [page, setPage] = useState(1);
  const { content } = useSelector((state) => state.content);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  const {
    data: contentData,
    isLoading,
    error,
    refetch,
  } = useGetUserContentQuery(
    { userId: currentUser?._id, page, limit: 20 },
    { skip: !currentUser?._id }
  );

  const pagination = contentData?.pagination;

  if (isLoading) {
    return (
      <div className="mt-4 grid grid-cols-5 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-white rounded-xl border border-gray-200 shadow animate-pulse"
          >
            <div className="w-full h-full bg-gray-200 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to load content
        </h3>
        <p className="text-gray-500">
          There was an error loading your content. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-[#FFB300] text-black rounded-xl hover:bg-[#e0a200] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="mt-4 text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No content yet
        </h3>
        <p className="text-gray-500 mb-6">
          You haven't posted any content yet. Start sharing your moments!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mt-4 grid grid-cols-5 gap-4">
        {content.map((post) => (
          <motion.div
            key={post._id}
            whileHover={{ rotate: 1, scale: 1.02 }}
            className="h-28 bg-white rounded-xl shadow-xl border border-gray-300 relative overflow-hidden cursor-pointer"
            onClick={() => {
              setSelectedMedia(post.media);
              setViewerOpen(true);
            }}
          >
            {post.media?.length > 1 && (
              <div className="absolute top-1.5 right-1.5 bg-black/60 rounded-full p-1 z-10">
                <Squares2X2Icon className="w-4 h-4 text-white" />
              </div>
            )}

            {post.media && post.media.length > 0 ? (
              <img
                src={post.media[0].url}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#FFB300] to-[#e0a200] flex items-center justify-center">
                <span className="text-white text-xs font-medium text-center px-2">
                  {post.title || "No title"}
                </span>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <div className="text-[9px] text-white font-medium truncate">
                {post.title}
              </div>
              <div className="text-[8px] text-gray-300">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>

            {post.likes && post.likes.length > 0 && (
              <div className="absolute top-2 right-2 bg-black/50 rounded-full px-1.5 py-0.5">
                <span className="text-[8px] text-white">
                  ❤️ {post.likes.length}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <MediaViewerModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        media={selectedMedia}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export function EventsTab() {
  const [page, setPage] = useState(1);
  const {
    data: userTicketsData,
    isLoading,
    error,
    refetch,
  } = useGetUserPurchasedEventsQuery({
    page,
    limit: 20,
  });

  const events = userTicketsData?.events || [];
  const pagination = userTicketsData?.pagination;
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [uploaderOpen, setUploaderOpen] = useState(false);

  const openUploader = (event) => {
    setSelectedEvent(event);
    setUploaderOpen(true);
  };

  const closeUploader = () => {
    setSelectedEvent(null);
    setUploaderOpen(false);
  };

  if (isLoading) {
    return (
      <div className="mt-4 grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-100 p-1">
              <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 p-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded flex-1"></div>
                  <div className="h-6 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to load events
        </h3>
        <p className="text-gray-500">
          There was an error loading your events. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-[#FFB300] text-black rounded-xl hover:bg-[#e0a200] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="mt-4 text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No events yet
        </h3>
        <p className="text-gray-500 mb-6">
          You haven't purchased any tickets yet. Browse events and get your
          first ticket!
        </p>
        <button
          onClick={() => (window.location.href = "/events")}
          className="px-6 py-3 bg-[#FFB300] text-black rounded-xl hover:bg-[#e0a200] transition font-medium"
        >
          Browse Events
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((eventData) => (
          <motion.div
            key={eventData.ticketId}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition overflow-hidden"
          >
            <div className="flex p-3">
              <img
                src={eventData.banner_url}
                alt={eventData.eventTitle}
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
                }}
              />

              <div className="flex-1 ml-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                    {eventData.eventTitle}
                  </h3>

                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(eventData.eventDate).toLocaleDateString()}
                  </p>

                  {/* <p className="text-xs text-gray-500 mb-2">
                    📍{" "}
                    {eventData.eventVenu?.name ||
                      eventData.eventVenu?.address ||
                      "Location TBD"}
                  </p> */}

                  {/* <div className="flex items-center gap-2 mb-3">
                    {eventData.package && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {eventData.package.name}
                      </span>
                    )}

                    {eventData.isGift && (
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                        Gift
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    Ticket #:{" "}
                    <span className="font-medium text-gray-700">
                      {eventData.ticketNumber}
                    </span>
                  </div> */}
                </div>

                <div className="flex gap-2 mt-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-[#FFB300] text-black text-xs py-2 rounded-lg hover:bg-[#e0a200] transition shadow flex items-center justify-center gap-1"
                    onClick={() => openUploader(eventData)}
                  >
                    <ArrowUpTrayIcon className="w-3 h-3" />
                    Upload
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-black text-white text-xs py-2 rounded-lg hover:bg-[#1a1a1a] transition shadow flex items-center justify-center gap-1"
                    onClick={() => {
                      window.location.href = `/events/${eventData.eventSlug}`;
                    }}
                  >
                    <EyeIcon className="w-3 h-3" />
                    View
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {selectedEvent && (
        <GalleryUploaderModal
          open={uploaderOpen}
          onClose={closeUploader}
          event={selectedEvent}
        />
      )}
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
