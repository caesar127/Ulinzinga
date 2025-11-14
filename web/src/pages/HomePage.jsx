import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import searicon from "../assets/icons/searchicon.svg";
import arrowicon from "../assets/icons/arrowicon.svg";
import filtericon from "../assets/icons/filtericon.svg";
import walleticon from "../assets/icons/walleticon.svg";
import placeholderImage from "../assets/Nostalgia-Brunch-124.webp";
import {
  useGetUpcomingEventsQuery,
  useGetEventsQuery,
} from "../features/events/eventsApiSlice";
import EventsFilterBar from "../components/EventsFilterBar";
import EventCard from "../components/EventCard";

function HomePage() {
  const { user } = useSelector((state) => state.auth);
  const { events } = useSelector((state) => state.event);

  const { data: upcomingData } = useGetUpcomingEventsQuery(1);
  const heroEvent = upcomingData?.events?.[0];

  const { data: eventsData } = useGetEventsQuery({
    page: 1,
    limit: 8,
    is_past: "false",
  });

  return (
    <div className="w-full px-24">
      <div className="py-6">
        <div className="text-left flex flex-row justify-between items-center space-x-32">
          <div className="space-y-6 w-full">
            <h1 className="text-[44px] font-medium mb-4 w-[80%]">
              Discover the moments and every experience through one platform.
            </h1>
            <p className="text-[#7B7979] w-[70%]">
              From concerts to community events, find, save, and share
              unforgettable experiences all in one place.
            </p>
            <div>
              <img
                src="https://blog.photofeeler.com/wp-content/uploads/2017/02/flattering-pose-profile-pics.jpeg"
                alt=""
                className="h-12 w-12 rounded-full"
              />
            </div>
            <div className="relative w-[55%]">
              <img
                src={searicon}
                alt="Search"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 text-gray-400"
              />
              <input
                type="search"
                placeholder="What do you want to see live?"
                className="bg-[#F3F3F3] pr-12 pl-4 py-5 rounded-full text-sm w-full focus:outline-none"
              />
            </div>
          </div>

          {/* Hero Image Section */}
          <div className="relative rounded-2xl w-[60%] overflow-hidden">
            <img
              src={heroEvent?.banner_url || placeholderImage}
              alt={heroEvent?.title || "Hero"}
              className="rounded-2xl h-[60vh] w-full object-cover"
            />
            {heroEvent && (
              <>
                <div className="absolute top-2 left-2 bg-white h-12 w-12 rounded-full flex items-center justify-center shadow-md">
                  {new Date(heroEvent.start_date).getDate()}
                </div>
                <div className="absolute bottom-2 right-2 bg-white h-10 px-2 rounded-full flex items-center justify-center space-x-3 shadow-md">
                  <img
                    src={heroEvent.logo_url || placeholderImage}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="mr-2">
                    <p className="text-xs font-medium">{heroEvent.title}</p>
                    <p className="text-xs text-gray-500">
                      {heroEvent.merchantName}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-[#F3F3F3] mt-12 px-24 py-8 rounded-3xl flex items-center">
          <Link
            to="/register"
            className="bg-[#FFB300] text-xs text-white px-3 py-2 rounded-full flex items-center space-x-2"
          >
            <span className="px-3">Get Started</span>
            <img src={arrowicon} alt="arrow" className="h-9 w-9" />
          </Link>

          <p className="text-[#7B7979] text-xs ml-8">
            Get personalized feed after signing up with ulizinga.....
          </p>
        </div>
      </div>

      {/* Events Section */}
      <div className="py-6 space-y-12">
        <EventsFilterBar />

        <div className="grid grid-cols-4 gap-12 mt-8">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>

      <div className="bg-black rounded-4xl flex justify-center items-center text-white mt-20 mx-32 px-32 py-12 space-x-18">
        <img
          src={walleticon}
          alt="Wallet Icon"
          className="h-[25vh] md:h-[40vh]"
        />

        <div className="flex flex-col text-left space-y-6">
          <h1 className="text-xl md:text-xl">
            Turn Your Savings into Experiences!
          </h1>
          <p className="text-base text-[#949494] max-w-xl">
            Start saving for the events you can’t wait for. Your wallet makes it
            easy to plan, and enjoy every moment.
          </p>

          <Link className="inline-flex bg-[#FFB300] text-xs md:text-sm text-white px-4 py-2 rounded-full items-center space-x-2 w-40">
            <span>How it works</span>
            <img
              src={arrowicon}
              alt="arrow"
              className="h-6 w-6 md:h-9 md:w-9"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
