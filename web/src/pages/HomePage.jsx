import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import searicon from "../assets/icons/searchicon.svg";
import arrowicon from "../assets/icons/arrowicon.svg";
import walleticon from "../assets/icons/walleticon.svg";
import placeholderImage from "../assets/Nostalgia-Brunch-124.webp";

import {
  useLazyGetEventsQuery,
  useLazySearchEventsQuery,
} from "../features/events/eventsApiSlice";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import { setSelectedEvent } from "../features/events/eventsSlice";
import {
  useGetRecommendedEventsQuery,
  useGetTrendingEventsQuery,
  useGetEventsByInterestsQuery,
} from "../features/user-events/userEventsApiSlice";
import { useGetUsersQuery } from "../features/users/usersApiSlice";
import { useGetCategoriesQuery } from "../features/category/categoryApiSlice";

import EventsFilterBar from "../components/EventsFilterBar";
import EventCard from "../components/EventCard";

const PAGE_SIZE = 8;

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

function getEventParams({ selectedType }) {
  const isRecent = selectedType === "recent";

  const params = {
    page: 1,
    limit: PAGE_SIZE,
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

function HomePage() {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.event);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [selectedType, setSelectedType] = useState("upcoming");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [isSearching, setIsSearching] = useState(false);

  const [getEvents, { isLoading: eventsLoading }] = useLazyGetEventsQuery();
  const [searchEvents, { data: searchData, isLoading: searchLoading }] =
    useLazySearchEventsQuery();

  useGetRecommendedEventsQuery(10, { skip: !isAuthenticated });
  useGetTrendingEventsQuery(10, { skip: !isAuthenticated });
  useGetEventsByInterestsQuery(10, { skip: !isAuthenticated });

  const { data: users } = useGetUsersQuery();
  const { data: categoryData } = useGetCategoriesQuery();
  const categories = categoryData?.categories || [];

  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => (map[cat.name] = cat._id));
    return map;
  }, [categories]);

  useEffect(() => {
    getEvents(getEventParams({ selectedType }));
  }, [getEvents, selectedType]);

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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-24 pb-16">
      <div className="py-6">
        <div className="text-left flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 lg:gap-16">
          <div className="space-y-6 w-full lg:w-[45%]">
            <h1 className="text-[32px] sm:text-[40px] lg:text-[44px] font-medium mb-4 w-full lg:w-[80%]">
              Discover the moments and every experience through one platform.
            </h1>

            <p className="text-[#7B7979] w-full lg:w-[70%]">
              From concerts to community events, find, save, and share
              unforgettable experiences all in one place.
            </p>

            <div className="flex -space-x-3">
              {users?.users?.slice(0, 5).map((user) =>
                user.profile?.picture ? (
                  <img
                    key={user._id}
                    src={user.profile.picture}
                    alt={user.name || "User"}
                    className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div
                    key={user._id}
                    className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm border-2 border-white"
                  >
                    {(user.name || user.username || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )
              )}
            </div>

            <div className="relative w-full sm:w-[85%] lg:w-[55%]">
              <img
                src={searicon}
                alt="Search"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 text-gray-400"
              />
              <input
                type="search"
                placeholder="What do you want to see live?"
                className="bg-[#F3F3F3] pr-12 pl-4 py-5 rounded-full text-sm w-full focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="relative rounded-2xl w-full lg:w-[40%] overflow-hidden">
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              autoplay={{ delay: 7000, disableOnInteraction: false }}
              loop={sortedEvents.length > 1}
              className="w-full h-[42vh] sm:h-[55vh] lg:h-[80vh]"
            >
              {sortedEvents.map((event) => (
                <SwiperSlide key={event._id}>
                  <Link
                    to="/eventdetails"
                    onClick={() => {
                      dispatch(setSelectedEvent(event));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="block relative w-full h-full overflow-hidden shadow-2xl"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${
                          event.banner_url || placeholderImage
                        })`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4 bg-white h-14 w-14 rounded-xl text-center shadow-lg flex flex-col justify-center">
                      <span className="text-lg font-semibold leading-none">
                        {new Date(event.start_date).getDate()}
                      </span>
                      <span className="text-[11px] uppercase text-gray-500">
                        {new Date(event.start_date).toLocaleDateString(
                          undefined,
                          { month: "short" }
                        )}
                      </span>
                    </div>

                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                      <h1 className="text-base sm:text-lg lg:text-xl font-[500] text-white drop-shadow-lg">
                        {event.title}
                      </h1>

                      <div className="mt-3 sm:mt-4 flex items-center gap-3">
                        <img
                          src={event.logo_url || event.banner_url}
                          alt="Organizer logo"
                          className="h-10 w-10 rounded-full border border-white/20 object-cover shadow"
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-white/60">Presented by</p>
                          <p className="text-sm text-white font-medium truncate">
                            {event.merchantName || "Organizer"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-6 right-6 bg-black/50 text-white text-xs px-4 py-2 rounded-full">
                        View event →
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="bg-[#F3F3F3] mt-12 px-5 sm:px-10 lg:px-24 py-6 sm:py-8 rounded-3xl flex flex-col sm:flex-row sm:items-center gap-4">
          <Link
            to={isAuthenticated ? "/events" : "/signin"}
            className="bg-[#FFB300] text-xs text-white px-3 py-2 rounded-full flex items-center space-x-2 w-fit"
          >
            <span className="px-3">Get Started</span>
            <img src={arrowicon} alt="arrow" className="h-9 w-9" />
          </Link>

          <p className="text-[#7B7979] text-xs sm:ml-4 lg:ml-8">
            Get personalized feed after signing up with ulizinga.....
          </p>
        </div>
      </div>

      <div className="py-6 space-y-12">
        <EventsFilterBar
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {eventsLoading || searchLoading ? (
            Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 animate-pulse rounded-lg h-64"
              />
            ))
          ) : displayEvents.length > 0 ? (
            displayEvents.map((event) => (
              <EventCard key={event._id || event.id} event={event} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <p>
                {isSearching
                  ? "No events found for your search"
                  : `No ${selectedType} events found`}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-black rounded-4xl flex flex-col md:flex-row justify-center items-center text-white mt-20 mx-0 sm:mx-6 lg:mx-32 px-6 sm:px-10 lg:px-32 py-10 sm:py-12 gap-10 md:gap-12">
        <img
          src={walleticon}
          alt="Wallet Icon"
          className="h-[22vh] sm:h-[25vh] md:h-[40vh]"
        />

        <div className="flex flex-col text-left space-y-6 w-full md:w-auto">
          <h1 className="text-xl md:text-xl">Turn Your Savings into Experiences!</h1>

          <p className="text-base text-[#949494] font-[300] max-w-xl">
            Start saving for the events you can’t wait for. Your wallet makes it
            easy to plan, and enjoy every moment.
          </p>

          <Link
            to="/how-it-works"
            className="inline-flex bg-[#FFB300] text-xs md:text-sm text-white px-4 py-2 rounded-full items-center space-x-2 w-40"
          >
            <span>How it works</span>
            <img src={arrowicon} alt="arrow" className="h-6 w-6 md:h-9 md:w-9" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
