import React from "react";
import GalleryFeed from "../components/GalleryFeed";
import funagamesicon from "../assets/icons/funagamesicon.svg";
import EventsFilterBar from "../components/EventsFilterBar";
import liveshowsicon from "../assets/icons/liveshowsicon.svg";

function GalleryPage() {
  const images = [
    {
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      name: "Alicia Green",
      title: "Live Concert Night",
    },
    {
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      name: "Daniel Cho",
      title: "Friends Meetup",
    },
    {
      image: "https://images.unsplash.com/photo-1531058020387-3be344556be6",
      avatar: "https://randomuser.me/api/portraits/women/76.jpg",
      name: "Marina Lopes",
      title: "Festival Lights",
    },
    {
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
      avatar: "https://randomuser.me/api/portraits/men/24.jpg",
      name: "Tom Becker",
      title: "Stage Experience",
    },
    {
      image: "https://images.unsplash.com/photo-1504805572947-34fad45aed93",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      name: "Eric Mbaye",
      title: "Rock Vibes",
    },
    {
      image: "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a",
      avatar: "https://randomuser.me/api/portraits/women/14.jpg",
      name: "Sophie Tran",
      title: "Dance Floor Energy",
    },
    {
      image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659",
      avatar: "https://randomuser.me/api/portraits/men/37.jpg",
      name: "Nico Brown",
      title: "Wedding Ceremony",
    },
    {
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      avatar: "https://randomuser.me/api/portraits/women/41.jpg",
      name: "Amara Bello",
      title: "Beach Party",
    },
    {
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
      avatar: "https://randomuser.me/api/portraits/men/29.jpg",
      name: "Liam Okoro",
      title: "DJ Festival",
    },
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      avatar: "https://randomuser.me/api/portraits/men/20.jpg",
      name: "Peter Zhou",
      title: "Art Exhibition",
    },
    {
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      name: "Leah Wanjiru",
      title: "Club Lights",
    },
    {
      image: "https://images.unsplash.com/photo-1504805572947-34fad45aed93",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      name: "Marcus Hale",
      title: "Outdoor Festival",
    },
  ];

  return (
    <div className="min-h-screen px-24">
      <div className="flex flex-col justify-center items-center h-auto md:h-[75vh] py-20 md:py-32 px-4 mb-14">
        <h1 className="text-xl md:text-2xl text-[#424242] font-[400] mb-2 md:mb-4 text-center">
          Discover the Scenes
        </h1>

        <h1 className="text-xl md:text-2xl font-[500] mb-6 text-center">
          That Bring Our Platform to Life
        </h1>

        <div className="relative flex items-center justify-center my-10 md:my-20 -space-x-1 w-full max-w-[560px] md:max-w-none">
          {/* Floating Icons */}
          <img
            src={funagamesicon}
            className="absolute z-60 top-[8%] right-[8%] md:-top-[28%] md:right-[21%] h-14 md:h-16"
            alt=""
          />

          <img
            src={liveshowsicon}
            className="absolute z-60 bottom-[8%] left-[8%] md:-bottom-[33%] md:left-[13%] h-14 md:h-16"
            alt=""
          />

          {/* Main Image Cluster */}
          <img
            src={images[0].image}
            className="h-40 w-36 md:h-52 md:w-48 object-cover rounded-3xl shadow-xl shadow-white -rotate-5 -mr-2 z-50"
            alt=""
          />

          <img
            src={images[1].image}
            className="h-44 w-40 md:h-56 md:w-52 object-cover rounded-3xl shadow-xl shadow-white z-40 -mr-1 delay-150"
            alt=""
          />

          <img
            src={images[2].image}
            className="h-40 w-36 md:h-50 md:w-48 object-cover rounded-3xl shadow-xl shadow-white rotate-5 z-30 -mr-1 delay-300"
            alt=""
          />

          <img
            src={images[3].image}
            className="h-44 w-36 md:h-54 md:w-48 object-cover rounded-3xl shadow-xl shadow-white -rotate-2 z-20 -mr-2 delay-200"
            alt=""
          />

          <img
            src={images[4].image}
            className="h-40 w-36 md:h-52 md:w-48 object-cover rounded-3xl shadow-xl shadow-white -rotate-7 z-10 delay-500"
            alt=""
          />
        </div>

        <p className="text-[#949494] text-center text-base md:text-lg font-[300] w-full md:w-[38%] px-2">
          From concerts to community events, find, save, and share unforgettable
          experiences all in one place.
        </p>
      </div>

      <EventsFilterBar />
      <GalleryFeed images={images} />
    </div>
  );
}

export default GalleryPage;
