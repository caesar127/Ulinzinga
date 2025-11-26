import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import arrowicon from "../assets/icons/arrowicon.svg";
import {
  useGetEventByIdQuery,
  useGetEventsQuery,
  usePurchaseTicketMutation,
} from "../features/events/eventsApiSlice";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";
import { formatCurrency } from "../shared/utils";

function EventDetailsPage() {
  const navigate = useNavigate();
  const { selectedEvent, events, isLoading } = useSelector(
    (state) => state.event
  );
  const [selectedPackage, setSelectedPackage] = React.useState(null);
  const [checkoutVisible, setCheckoutVisible] = React.useState(false);

  const event = selectedEvent || {};

  const [purchaseTicket] = usePurchaseTicketMutation();

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useGetEventByIdQuery(event?.slug, {
    skip: !event?.slug,
  });

  useGetEventsQuery(
    {
      page: 1,
      limit: 20,
      is_past: false,
    },
    {
      skip: events !== null,
    }
  );

  React.useEffect(() => {
    setSelectedPackage(null);
    setCheckoutVisible(false);
  }, [selectedEvent]);

  const handleBuyTicket = () => {
    if (!selectedPackage) return;
    setCheckoutVisible(true);
  };

  const handlePay = async () => {
    if (!selectedPackage) return;

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      const res = await purchaseTicket({
        eventSlug: event.slug,
        package_id: selectedPackage.id,
        name: fullName,
        email: formData.email,
        quantity: 1,
      }).unwrap();

      const paymentUrl = res?.data?.redirect_url;
      if (paymentUrl) {
        window.open(paymentUrl, "_blank");
      } else {
        handleErrorToast2("No redirect URL found in response");
      }
    } catch (err) {
      handleErrorToast2("Ooops! Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-32 py-8">
      <div className="flex justify-between">
        <div className="w-full relative group">
          {event?.start_date && (
            <div className="absolute top-6 left-6 bg-white px-3 py-2 rounded-xl shadow-md text-center z-10">
              <span className="block text-base font-semibold">
                {new Date(event.start_date).getDate()}
              </span>
              <span className="block text-xs uppercase">
                {new Date(event.start_date).toLocaleDateString(undefined, {
                  month: "short",
                })}
              </span>
            </div>
          )}

          <img
            src={event?.banner_url}
            alt=""
            className="h-[82vh] w-[80%] rounded-3xl object-cover"
          />
          <div className="absolute bottom-0 left-0 p-6 rounded-b-3xl z-20 bg-gradient-to-t from-black via-black/80 to-transparent w-[80%]">
            <h1 className="text-2xl font-[500] text-white pt-[20%] mb-4">
              {event?.title}
            </h1>
            <div className="flex space-x-2 items-center">
              <img
                src={event.logo_url || event.banner_url}
                alt={event.title}
                className="h-10 w-10 rounded-full bg-gray-200"
              />
              <div>
                <span className="text-white text-xs">Presented by </span>
                <p className="text-white/80 text-sm mt-0.5">
                  {event?.merchantName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!checkoutVisible && (
          <div id="details-section" className="w-full space-y-4">
            <div>
              <h2 className="mb-1 font-[500]">Description</h2>
              <p className="text-[#949494] text-sm w-[80%]">
                {event?.description}
              </p>
            </div>

            <div>
              <h2 className="mb-1 font-[500]">Event Location</h2>
              <p className="text-[#949494] text-sm">{event?.venue?.name}</p>
              <p className="text-[#949494] text-sm">{event?.venue?.address}</p>
            </div>

            <div>
              <h2 className="mb-1 font-[500]">Available Tickets</h2>
              <p className="text-[#949494] text-sm mb-3">
                From concerts to community events, find, save, and share
              </p>

              <div className="space-y-4 mb-6">
                {event?.packages?.length > 0 ? (
                  event.packages.map((p, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedPackage(p)}
                      className={`cursor-pointer bg-[#F4F4F4] border-2 rounded-3xl p-4 space-y-2 transition ${
                        selectedPackage?.id === p.id
                          ? "border-[#FFB300]"
                          : "border-[#ACACAC]/20"
                      }`}
                    >
                      <div className="px-2 py-1 bg-[#FFB300] text-white text-sm rounded-3xl inline-flex items-center gap-3">
                        <span className="w-3 h-3 bg-[#0F0E0E]/40 rounded-full"></span>
                        <span className="text-xs">{p.name}</span>
                      </div>

                      <h1 className="font-[500] text-sm">
                        {formatCurrency(p.price, event.balance?.currency)}
                      </h1>
                      <p className="text-[#949494] text-xs">{p.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    No ticket packages available
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#FFB300] text-xs mb-1">Total price</p>
                  <h1 className="font-[600] text-xl">
                    {selectedPackage
                      ? formatCurrency(
                          selectedPackage.price,
                          event.balance?.currency
                        )
                      : "Select a package"}
                  </h1>
                </div>
                <button
                  onClick={handleBuyTicket}
                  className="bg-black text-white rounded-full flex items-center space-x-2 px-2 py-2 text-xs ml-2"
                >
                  <span className="pl-7 pr-3 text-sm">Buy Ticket</span>
                  <img src={arrowicon} alt="arrow" className="h-7 w-7" />
                </button>
              </div>
            </div>
          </div>
        )}

        {checkoutVisible && selectedPackage && (
          <div id="checkout-section" className="w-full space-y-4">
            <h2 className="font-[500] text-lg mb-2">Checkout</h2>
            <p>
              Purchasing: <strong>{selectedPackage.name}</strong> –{" "}
              {formatCurrency(selectedPackage.price, event.balance?.currency)}
            </p>

            <div className="flex justify-between space-x-3">
              <input
                type="text"
                placeholder="First Name"
                className="p-3 bg-[#F3F3F3] rounded-lg focus:outline-none w-full"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                className="p-3 bg-[#F3F3F3] rounded-lg focus:outline-none w-full"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
            <input
              type="text"
              name="email"
              placeholder="you@email.com"
              className="p-3 bg-[#F3F3F3] rounded-lg focus:outline-none w-full"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <button
              onClick={handlePay}
              disabled={isLoading}
              className="bg-black w-full text-white py-4 rounded-lg disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Pay now"}
            </button>
          </div>
        )}
      </div>

      <div className="py-6 mt-[8%]">
        <div className="space-y-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-[500] mb-1">Similar Events</h1>
            <p className="text-sm text-[#949494]">
              You may also like some of the recommended events.
            </p>
          </div>
          <Link
            to={"/events"}
            className="border border-[#ACACAC] rounded-full flex items-center space-x-2 px-5 py-2"
          >
            <span className="text-sm">See more</span>
            <img src={arrowicon} alt="Filter" className="h-7 w-7" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-12 mt-8">
          {events.slice(0, 4).map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventDetailsPage;
