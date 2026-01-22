import React, { useState } from "react";
import { Link } from "react-router-dom";
import filtericon from "../assets/icons/filtericon.svg";
import { useGetCategoriesQuery } from "../features/category/categoryApiSlice";

function EventsFilterBar({ selectedType, setSelectedType, selectedCategory, setSelectedCategory }) {
  const { data: categoryData, isLoading } = useGetCategoriesQuery();
  const categories = categoryData?.categories || categoryData || [];

  return (
    <div className="flex justify-between items-center">
      {/* Type Dropdown */}
      <div className="relative w-[17%]">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="appearance-none w-full bg-white border border-[#ACACAC] rounded-lg py-3 px-5 text-sm pr-10 focus:outline-none focus:ring-0 focus:ring-[#FFB300]"
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past Events</option>
          <option value="recent">Recent</option>
          <option value="trending">Trending</option>
          <option value="recommended">Recommended</option>
          <option value="hot">Hot</option>
        </select>
        {/* Custom arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Tabs / Buttons */}
      <ul className="flex space-x-4 text-sm w-full overflow-x-auto whitespace-nowrap items-center mx-8 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("")}
          className={`inline-block px-5 py-3 rounded-full ${
            selectedCategory === "" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.categoryId}
            onClick={() => setSelectedCategory(cat.name)}
            className={`inline-block px-5 py-3 rounded-full ${
              selectedCategory === cat.name ? "bg-black text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </ul>

      {/* Filter Button */}
      <button className="border border-[#ACACAC] rounded-full flex items-center space-x-2 px-5 py-2">
        <img src={filtericon} alt="Filter" className="h-4 w-4" />
        <span>Filter</span>
      </button>
    </div>
  );
}

export default EventsFilterBar;
