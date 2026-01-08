import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  UsersIcon,
  TicketIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  setSelectedEvent,
  clearEvents,
} from "@/features/organizer-events/organizerEventsSlice";
import {
  useGetOrganizerEventsQuery,
  useGetOrganizerEventByIdQuery,
} from "@/features/organizer-events/organizerEventsApiSlice";
import {
  useGetStallByEventQuery,
  useGetStallSummaryQuery,
} from "@/features/stalls/stallsApiSlice";

function EventManagementPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedEvent } = useSelector((state) => state.organizerEvents);
  console.log("selectedEvent", selectedEvent);
  const [activeTab, setActiveTab] = useState("overview");
  
  const {
    data: eventData,
    isLoading: eventLoading,
    isError: eventError,
    error: eventErrorMsg,
  } = useGetOrganizerEventByIdQuery({
    id: selectedEvent?.id,
    merchantId: user.profile.business.reference,
  });

  const {
    data: stallsData,
    isLoading: stallsLoading,
    error: stallsError,
  } = useGetStallByEventQuery(eventId);

  const {
    data: stallSummary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useGetStallSummaryQuery(eventId);

  const isLoading = eventLoading || stallsLoading || summaryLoading;
  const hasError = eventError ;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.toDateString() === end.toDateString()) {
      return formatDate(startDate);
    }

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const realStats = {
    totalTicketsSold: stallSummary?.totalTicketsSold || event?.packages?.reduce((sum, pkg) => sum + (pkg.sold || 0), 0) || 0,
    totalRevenue: stallSummary?.totalRevenue || 0,
    totalAttendees: stallSummary?.totalAttendees || event?.packages?.reduce((sum, pkg) => sum + (pkg.sold || 0), 0) || 0,
    availableStalls: stallSummary?.availableStalls || 0,
    occupiedStalls: stallSummary?.occupiedStalls || 0,
    checkInRate: stallSummary?.checkInRate || 0,
    vipTickets: event?.packages?.find(pkg => pkg.name.toLowerCase().includes('executive'))?.sold || 0,
    generalTickets: event?.packages?.find(pkg => pkg.name.toLowerCase().includes('standard'))?.sold || 0,
  };

  const realStalls = stallsData?.data || [];
  const realPackages = event?.packages || [];
  const realAttendees = []; // Attendees data not available in current event structure

  const tabs = [
    { id: "overview", name: "Overview", icon: EyeIcon },
    { id: "stats", name: "Statistics", icon: ChartBarIcon },
    { id: "attendees", name: "Attendees", icon: UsersIcon },
    { id: "stalls", name: "Stalls", icon: BuildingStorefrontIcon },
    { id: "tickets", name: "Tickets", icon: TicketIcon },
  ];

  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="bg-white p-6 rounded-3xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{selectedEvent?.title}</h2>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarIcon className="h-5 w-5" />
                <span>
                  {event?.end_date
                    ? formatDateRange(event.start_date, event.end_date)
                    : formatDate(event?.start_date)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPinIcon className="h-5 w-5" />
                <span>
                  {selectedEvent?.venue?.name || 'Venue TBD'} - {selectedEvent?.venue?.location || selectedEvent?.venue?.address || 'Location TBD'}
                </span>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{selectedEvent?.description}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#FFB300] text-white rounded-xl hover:bg-black flex items-center gap-2">
              <PencilIcon className="h-4 w-4" />
              Edit Event
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tickets Sold"
          value={realStats.totalTicketsSold}
          icon={TicketIcon}
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={`$${realStats.totalRevenue.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          color="yellow"
        />
        <StatCard
          title="Attendees"
          value={realStats.totalAttendees}
          icon={UsersIcon}
          color="blue"
        />
        <StatCard
          title="Check-in Rate"
          value={`${realStats.checkInRate}%`}
          icon={EyeIcon}
          color="purple"
        />
      </div>
    </div>
  );

  const StatsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Tickets Sold Today"
          value="85"
          icon={TicketIcon}
          color="green"
        />
        <StatCard
          title="Revenue Today"
          value="$3,200"
          icon={CurrencyDollarIcon}
          color="yellow"
        />
        <StatCard
          title="Check-ins Today"
          value="72"
          icon={UsersIcon}
          color="blue"
        />
        <StatCard
          title="Occupied Stalls"
          value={`${realStats.occupiedStalls}/${
            realStats.occupiedStalls + realStats.availableStalls
          }`}
          icon={BuildingStorefrontIcon}
          color="indigo"
        />
        <StatCard
          title="Peak Hour"
          value="2:00 PM"
          icon={CalendarIcon}
          color="red"
        />
        <StatCard
          title="Avg. Ticket Price"
          value="$36.48"
          icon={CurrencyDollarIcon}
          color="green"
        />
      </div>

      {/* Placeholder for charts - you can integrate with Chart.js or Recharts */}
      <div className="bg-white p-6 rounded-3xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sales Analytics
        </h3>
        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
          <p className="text-gray-500">Chart integration placeholder</p>
        </div>
      </div>
    </div>
  );

  const AttendeesTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Attendee List</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search attendees..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            <button className="px-4 py-2 bg-[#FFB300] text-white rounded-lg hover:bg-black">
              Export
            </button>
          </div>
        </div>

        {realAttendees.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-[#8B909A]">
                  Name
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-[#8B909A]">
                  Email
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-[#8B909A]">
                  Ticket Type
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-[#8B909A]">
                  Check-in Status
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-[#8B909A]">
                  Check-in Time
                </th>
              </tr>
            </thead>
            <tbody>
              {realAttendees.map((attendee) => (
                <tr
                  key={attendee.id || attendee.userId}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm font-medium">
                    {attendee.name || attendee.fullName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {attendee.email}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                      {attendee.ticketType || "General"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        attendee.checkInStatus
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {attendee.checkInStatus ? "Checked In" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {attendee.checkInTime
                      ? formatDate(attendee.checkInTime)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Attendee data not available for this event.</p>
            <p className="text-sm text-gray-400 mt-2">
              Attendee information will be available after ticket sales begin.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const StallsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Stalls Management
          </h3>
          <button className="px-4 py-2 bg-[#FFB300] text-white rounded-lg hover:bg-black flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Create Stall
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {realStalls.map((stall) => (
            <div
              key={stall.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  {stall.name || stall.stallName}
                </h4>
                <span
                  className={`px-2 py-1 rounded-lg text-xs ${
                    stall.isOccupied || stall.status === "occupied"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {stall.isOccupied || stall.status === "occupied"
                    ? "Occupied"
                    : "Available"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {stall.vendor || stall.vendorName}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  ${stall.price || stall.rentalPrice}
                </span>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <PencilIcon className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <TrashIcon className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {realStalls.length === 0 && !stallsLoading && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No stalls found for this event.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const TicketsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Ticket Sales Analytics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {realStats.totalTicketsSold}
            </div>
            <div className="text-sm text-gray-600">Total Sold</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {event?.packages?.find(pkg => pkg.name.toLowerCase().includes('executive'))?.sold || 0}
            </div>
            <div className="text-sm text-gray-600">Executive Tickets</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {event?.packages?.find(pkg => pkg.name.toLowerCase().includes('standard'))?.sold || 0}
            </div>
            <div className="text-sm text-gray-600">Standard Tickets</div>
          </div>
        </div>

        {/* Package Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {realPackages.map((pkg) => (
            <div key={pkg.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                <span className="text-sm font-bold text-gray-900">${pkg.price}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sold: {pkg.sold}</span>
                <span className="text-gray-600">Available: {pkg.available}</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#FFB300] h-2 rounded-full"
                  style={{ width: `${(pkg.sold / pkg.quantity) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
          <p className="text-gray-500">Ticket sales chart placeholder</p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-full bg-[#F7F8F9] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFB300]"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (hasError || !selectedEvent) {
    return (
      <div className="h-full bg-[#F7F8F9] p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            {eventError
              ? `Error loading event: ${eventErrorMsg?.message}`
              : "Event not found"}
          </p>
          <button
            onClick={() => navigate("/organizer/events")}
            className="mt-4 px-4 py-2 bg-[#FFB300] text-white rounded-lg hover:bg-black"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#F7F8F9] p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/organizer/events")}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Event</h1>
            <p className="text-sm text-gray-600">Event management dashboard</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors rounded-xl ${
                    activeTab === tab.id
                      ? "border-[#FFB300] text-[#FFB300] bg-yellow-50"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "stats" && <StatsTab />}
          {activeTab === "attendees" && <AttendeesTab />}
          {activeTab === "stalls" && <StallsTab />}
          {activeTab === "tickets" && <TicketsTab />}
        </div>
      </div>
    </div>
  );
}

export default EventManagementPage;
