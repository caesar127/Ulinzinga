import React, { useState } from "react";
import CreateEventModal from "../components/CreateEventModal";

function EventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-[500]">Events</h1>
          <p className="mt-1 text-xs text-gray-500">
            Create and manage your events
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white rounded-lg px-4 py-2"
        >
          New Event
        </button>
      </div>
      <input
        type="text"
        name=""
        id=""
        className="px-4 py-2 bg-gray-100 rounded-lg"
      />
      <div className=""></div>
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default EventsPage;
