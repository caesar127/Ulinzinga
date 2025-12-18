import React, { useState } from "react";
import searchicon from "../assets/icons/searchicon.svg";
import searchicon2 from "../assets/icons/searchicon(1).svg";
import EventsFilterBar from "../components/EventsFilterBar";
import { useSelector } from "react-redux";
import { useGetEventsQuery } from "../features/events/eventsApiSlice";
import EventCard from "../components/EventCard";
import Pagination from "../shared/components/ui/Pagination";

function EventsPage() {
  const { user } = useSelector((state) => state.auth);
  const { events } = useSelector((state) => state.event);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const [filters, setFilters] = useState({
    isPast: false,
    visible: true,
    isActive: true,
  });

  const { data, isLoading, isError, error } = useGetEventsQuery({
    page: currentPage,
    limit: pageLimit,
    ...filters,
  });
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleLimitChange = (newLimit) => {
    setPageLimit(newLimit);
    setCurrentPage(1);
  };

  return (
    <div className="w-full px-24">
      <div className="py-2 flex flex-col justify-center items-center text-center space-y-4 h-[75vh]">
        <div className="flex justify-center items-center space-x-4 mb-8">
          <img
            src="https://blog.photofeeler.com/wp-content/uploads/2017/02/flattering-pose-profile-pics.jpeg"
            alt=""
            className="h-16 w-16 rounded-full shadow-lg shadow-[#FFB300]/50 object-cover"
          />
          <img
            src="https://blog.photofeeler.com/wp-content/uploads/2017/02/flattering-pose-profile-pics.jpeg"
            alt=""
            className="h-20 w-20 rounded-full shadow-lg shadow-[#FFB300]/50 object-cover"
          />
          <img
            src="https://blog.photofeeler.com/wp-content/uploads/2017/02/flattering-pose-profile-pics.jpeg"
            alt=""
            className="h-16 w-16 rounded-full shadow-lg shadow-[#FFB300]/50 object-cover"
          />
        </div>
        <h1 className="font-[500] text-3xl mb-4">
          <span className="text-[#FFB300]">Ulinzinga</span> Marketplace
        </h1>
        <h1 className="text-xl font-[500] mb-4">
          Where Every Ticket Gets a Second Chance.
        </h1>
        <p className="text-[#949494] w-1/4 text-[200]">
          Turn your unused tickets into someone else’s experience
        </p>
        <div className="flex justify-around items-center space-x-4 bg-[#F3F3F3] rounded-4xl px-6 py-4 w-[80%] mt-12">
          <div className="flex text-left items-center w-full">
            <img src={searchicon2} alt="" className="h-9 w-9" />
            <div className="ml-4 flex flex-col w-full">
              <label htmlFor="event name" className="text-sm">
                Name of Event
              </label>
              <input
                type="text"
                className="text-xs outline-none"
                placeholder="Type the event name"
              />
            </div>
          </div>
          <div className="flex text-left items-center w-full">
            <span className="text-4xl font-[100] mr-4 text-[#D9D9D9]">|</span>
            <img src={searchicon2} alt="" className="h-9 w-9" />
            <div className="ml-4 flex flex-col w-full">
              <label htmlFor="event name" className="text-sm">
                Location
              </label>
              <input
                type="text"
                className="text-xs outline-none"
                placeholder="Type the city or destination"
              />
            </div>
          </div>
          <div className="flex text-left items-center w-full">
            <span className="text-4xl font-[100] mr-4 text-[#D9D9D9]">|</span>
            <img src={searchicon2} alt="" className="h-9 w-9" />
            <div className="ml-4 flex flex-col w-full">
              <label htmlFor="date" className="text-sm">
                Date
              </label>
              <input
                type="text"
                className="text-xs outline-none"
                placeholder="Type the event date"
              />
            </div>
          </div>
          <img src={searchicon} alt="" className="h-14" />
        </div>
      </div>
      <div className="py-6 space-y-12">
        <EventsFilterBar />
        
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB300]"></div>
          </div>
        )}
        
        {isError && (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-600 text-center">
              <p className="text-lg font-medium">Error loading events</p>
              <p className="text-sm">{error?.message || 'Something went wrong'}</p>
            </div>
          </div>
        )}
        
        {!isLoading && !isError && data?.events && data.events.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {data.events.map((event) => (
                <EventCard key={event._id || event.id} event={event} />
              ))}
            </div>
            
            {data.pagination && data.pagination.totalPages > 1 && (
              <div className="mt-12 pt-6 border-t border-gray-200">
                <Pagination
                  currentPage={data.pagination.currentPage}
                  totalPages={data.pagination.totalPages}
                  totalCount={data.pagination.totalCount}
                  limit={data.pagination.limit}
                  hasNextPage={data.pagination.hasNextPage}
                  hasPrevPage={data.pagination.hasPrevPage}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                />
              </div>
            )}
          </>
        )}
        
        {!isLoading && !isError && (!data?.events || data.events.length === 0) && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-600">No events found</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or check back later</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsPage;
