import React from "react";
import searchicon from "../assets/icons/searchicon.svg";
import searchicon2 from "../assets/icons/searchicon(1).svg";
import EventsFilterBar from "../components/EventsFilterBar";

function MarketplacePage() {
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
      <EventsFilterBar />
    </div>
  );
}

export default MarketplacePage;
