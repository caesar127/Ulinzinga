import React from "react";
import GalleryFeed from "../components/GalleryFeed";
import funagamesicon from "../assets/icons/funagamesicon.svg";
import EventsFilterBar from "../components/EventsFilterBar";
import liveshowsicon from "../assets/icons/liveshowsicon.svg";
import { useGetGalleryQuery } from "../features/content/contentApiSlice";

function GalleryPage() {
  const { data: galleryData, isLoading, error } = useGetGalleryQuery({ limit: 50 });

  const images = galleryData?.content?.flatMap((content) =>
    content.media
      .filter((media) => media.type === "image")
      .map((media) => ({
        image: media.url,
        avatar: content.user?.avatar || "",
        name: content.user?.name || "Unknown",
        title: content.event?.title || content.caption || "Event Photo",
      }))
  ) || [];

  const heroImages = images.slice(0, 5);

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
            src={heroImages[0]?.image}
            className="h-40 w-36 md:h-52 md:w-48 object-cover rounded-3xl shadow-xl shadow-white -rotate-5 -mr-2 z-50"
            alt=""
          />

          <img
            src={heroImages[1]?.image}
            className="h-44 w-40 md:h-56 md:w-52 object-cover rounded-3xl shadow-xl shadow-white z-40 -mr-1 delay-150"
            alt=""
          />

          <img
            src={heroImages[2]?.image}
            className="h-40 w-36 md:h-50 md:w-48 object-cover rounded-3xl shadow-xl shadow-white rotate-5 z-30 -mr-1 delay-300"
            alt=""
          />

          <img
            src={heroImages[3]?.image}
            className="h-44 w-36 md:h-54 md:w-48 object-cover rounded-3xl shadow-xl shadow-white -rotate-2 z-20 -mr-2 delay-200"
            alt=""
          />

          <img
            src={heroImages[4]?.image}
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
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <GalleryFeed images={images} />
      )}
    </div>
  );
}

export default GalleryPage;
