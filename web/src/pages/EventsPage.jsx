import React, { useEffect, useMemo, useState } from "react";
import searchicon from "../assets/icons/searchicon.svg";
import searchicon2 from "../assets/icons/searchicon(1).svg";
import EventsFilterBar from "../components/EventsFilterBar";
import { useSelector } from "react-redux";
import {
  useLazyGetEventsQuery,
  useLazySearchEventsQuery,
} from "../features/events/eventsApiSlice";
import { useGetCategoriesQuery } from "../features/category/categoryApiSlice";
import EventCard from "../components/EventCard";

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

function getEventParams({ selectedType, page = 1, limit = 20 }) {
  const isRecent = selectedType === "recent";

  const params = {
    page,
    limit,
    visible: true,
    isActive: true,
    sortBy: isRecent ? "createdAt" : "start_date",
    sortOrder: isRecent ? "desc" : "asc",
  };

  if (selectedType === "past") params.isPast = "true";

  return params;
}

function getSearchParams({ q, selectedType, selectedCategory }) {
  const params = { visible: "true" };

  if (q) params.q = q;

  if (selectedType === "past") params.isPast = "true";
  if (selectedType === "upcoming") params.isPast = "false";

  if (selectedCategory) params.category = selectedCategory;

  return params;
}

function EventsPage() {
  const { events } = useSelector((state) => state.event);

  const [selectedType, setSelectedType] = useState("upcoming");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [isSearching, setIsSearching] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);

  const [getEvents, { isLoading: eventsLoading }] = useLazyGetEventsQuery();
  const [searchEvents, { data: searchData, isLoading: searchLoading }] =
    useLazySearchEventsQuery();

  const { data: categoryData } = useGetCategoriesQuery();
  const categories = categoryData?.categories || [];

  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => (map[cat.name] = cat._id));
    return map;
  }, [categories]);

  useEffect(() => {
    getEvents(getEventParams({ selectedType, page: currentPage, limit: pageLimit }));
  }, [getEvents, selectedType, currentPage, pageLimit]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q || selectedCategory) {
      setIsSearching(true);
      searchEvents(
        getSearchParams({
          q: q || undefined,
          selectedType,
          selectedCategory,
        })
      );
    } else {
      setIsSearching(false);
    }
  }, [debouncedQuery, selectedCategory, selectedType, searchEvents]);

  const sortedEvents = useMemo(() => {
    const today = new Date();
    let filtered = events;

    if (selectedType === "past") {
      filtered = filtered.filter((e) => new Date(e.start_date) < today);
    } else {
      filtered = filtered.filter((e) => new Date(e.start_date) > today);
    }

    if (selectedCategory) {
      const categoryId = categoryMap[selectedCategory];
      if (categoryId) {
        filtered = filtered.filter((e) => e.interests?.includes(categoryId));
      }
    }

    return [...filtered].sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
  }, [events, selectedType, selectedCategory, categoryMap]);

  const displayEvents = isSearching
    ? searchData?.events ?? sortedEvents
    : sortedEvents;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (newLimit) => {
    setPageLimit(newLimit);
    setCurrentPage(1);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-24">
      <div className="py-2 flex flex-col justify-center items-center text-center space-y-4 min-h-[75vh]">
        <div className="flex justify-center items-center space-x-3 sm:space-x-4 mb-8">
          <img
            src="https://blog.photofeeler.com/wp-content/uploads/2017/02/flattering-pose-profile-pics.jpeg"
            alt=""
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-lg shadow-[#FFB300]/50 object-cover"
          />
          <img
            src="https://blog.photofeeler.com/wp-content/uploads/2017/02/flattering-pose-profile-pics.jpeg"
            alt=""
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full shadow-lg shadow-[#FFB300]/50 object-cover"
          />
          <img
            src="https://blog.photofeeler.com/wp-content/uploads/2017/02/flattering-pose-profile-pics.jpeg"
            alt=""
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-lg shadow-[#FFB300]/50 object-cover"
          />
        </div>

        <h1 className="font-[500] text-2xl sm:text-3xl mb-4">
          <span className="text-[#FFB300]">Ulinzinga</span> Events
        </h1>

        <h1 className="text-lg sm:text-xl font-[500] mb-4">
          Where Every Experience Finds Its People.
        </h1>

        <p className="text-[#949494] w-full sm:w-2/3 md:w-1/2 lg:w-1/4 text-[200] px-2">
          What you miss becomes someone else’s highlight.
        </p>

        <div className="flex flex-col lg:flex-row justify-around items-stretch lg:items-center gap-4 lg:gap-0 bg-[#F3F3F3] rounded-4xl px-4 sm:px-6 py-4 w-full lg:w-[80%] mt-12">
          <div className="flex text-left items-center w-full">
            <img src={searchicon2} alt="" className="h-8 w-8 sm:h-9 sm:w-9" />
            <div className="ml-4 flex flex-col w-full">
              <label htmlFor="event name" className="text-sm">
                Name of Event
              </label>
              <input
                type="text"
                className="text-xs outline-none bg-transparent w-full"
                placeholder="Type the event name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="hidden lg:flex text-left items-center">
            <span className="text-4xl font-[100] mr-4 text-[#D9D9D9]">|</span>
          </div>

          <div className="flex text-left items-center w-full">
            <img src={searchicon2} alt="" className="h-8 w-8 sm:h-9 sm:w-9" />
            <div className="ml-4 flex flex-col w-full">
              <label htmlFor="event name" className="text-sm">
                Location
              </label>
              <input
                type="text"
                className="text-xs outline-none bg-transparent w-full"
                placeholder="Type the city or destination"
              />
            </div>
          </div>

          <div className="hidden lg:flex text-left items-center">
            <span className="text-4xl font-[100] mr-4 text-[#D9D9D9]">|</span>
          </div>

          <div className="flex text-left items-center w-full">
            <img src={searchicon2} alt="" className="h-8 w-8 sm:h-9 sm:w-9" />
            <div className="ml-4 flex flex-col w-full">
              <label htmlFor="date" className="text-sm">
                Date
              </label>
              <input
                type="text"
                className="text-xs outline-none bg-transparent w-full"
                placeholder="Type the event date"
              />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img src={searchicon} alt="" className="h-12 sm:h-14" />
          </div>
        </div>
      </div>

      <div className="py-6 space-y-12">
        <EventsFilterBar
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {eventsLoading || searchLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB300]"></div>
          </div>
        ) : displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {displayEvents.map((event) => (
              <EventCard key={event._id || event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-600">
                {isSearching
                  ? "No events found for your search"
                  : `No ${selectedType} events found`}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Try adjusting your filters or check back later
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsPage;
