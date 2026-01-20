import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import arrowicon from "../assets/icons/arrowicon.svg";
import {
  useGetEventByIdQuery,
  useGetEventsQuery,
  usePurchaseTicketMutation,
} from "../features/events/eventsApiSlice";
import EventCard from "../components/EventCard";
import { formatCurrency } from "../shared/utils";
import { handleErrorToast2 } from "../utils/toasts";
import { useState } from "react";
import { selectUser, selectIsAuthenticated } from "../features/auth/authSlice";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.45, ease: "easeOut" },
  }),
};

function EventDetailsPage() {
  const navigate = useNavigate();
  const { selectedEvent, events, isLoading } = useSelector(
    (state) => state.event
  );
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const event = selectedEvent || {};
  
  useGetEventByIdQuery(event?.slug, { skip: !event?.slug });
  
  useGetEventsQuery(
    {
      page: 1,
      limit: 20,
      isPast: false,
      visible: true,
      isActive: true,
    },
    { skip: events !== null }
  );

  const [purchaseTicket, { isLoading: isPurchasing }] =
    usePurchaseTicketMutation();

  const [selectedPackage, setSelectedPackage] = React.useState(null);
  const [checkoutVisible, setCheckoutVisible] = React.useState(false);

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  React.useEffect(() => {
    // reset package when event changes
    setSelectedPackage(null);
    setCheckoutVisible(false);
    setFormData({ firstName: "", lastName: "", email: "" });
  }, [event?.slug]);

  const handleBuyClick = (pkg) => {
    setSelectedPackage(pkg);
    setCheckoutVisible(true);
  };

  const handleBackdropClose = (e) => {
    if (e.target === e.currentTarget) {
      setCheckoutVisible(false);
    }
  };

  const [quantities, setQuantities] = useState({});

  const updateQty = (id, type) => {
    setQuantities((prev) => {
      const current = prev[id] ?? 1;
      if (type === "inc") return { ...prev, [id]: current + 1 };
      if (type === "dec") return { ...prev, [id]: Math.max(1, current - 1) };
      return prev;
    });
  };

  const handlePay = async () => {
    if (!selectedPackage) return;
    let name, email;
    if (isAuthenticated) {
      name = user.name;
      email = user.email;
    } else {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      if (!fullName || !formData.email) {
        handleErrorToast2("Please enter full name and email");
        return;
      }
      name = fullName;
      email = formData.email;
    }

    try {
      const res = await purchaseTicket({
        eventSlug: event.slug,
        package_id: selectedPackage.id,
        name,
        email,
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
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className="min-h-screen px-6 md:px-12 lg:px-28 py-8 bg-white"
    >
      {/* PAGE WRAPPER */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="enter"
        exit="exit"
        className=" px-4 md:px-6 py-2 bg-white flex justify-center"
      >
        <div className="w-full  mx-auto">
          <div className="relative w-full flex flex-col lg:flex-row gap-10">
            <motion.div
              className="relative lg:w-[60%] rounded-3xl overflow-hidden shadow-2xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.3, duration: 0.6 },
                },
              }}
            >
              <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]">
                <motion.img
                  src={event?.banner_url}
                  alt={event.title || "Event banner"}
                  className="w-full h-full object-cover rounded-3xl"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                />
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
                
                <motion.div
                  className="absolute bottom-6 left-6 right-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h1 className="text-base sm:text-base lg:text-lg font-[500] text-white drop-shadow-lg">
                    {event.title}
                  </h1>

                  <motion.div
                    className="mt-4 flex items-center gap-3"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <img
                      src={event.logo_url || event.banner_url}
                      className="h-10 w-10 rounded-full border border-white/20 object-cover shadow"
                    />
                    <div>
                      <p className="text-xs text-white/60">Presented by</p>
                      <p className="text-sm text-white font-medium">
                        {event.merchantName}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            <motion.aside
              className="w-full bg-white  h-fit"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            >
              
              <motion.div variants={fadeUp}>
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {event.category || "Event"} •{" "}
                  {new Date(event.start_date).toLocaleString()}
                </p>

                <p className="mt-4 text-gray-600 text-sm leading-relaxed line-clamp-3 w-[70%]">
                  {event.description}
                </p>
                
                <div className="mt-5">
                  <h3 className="text-sm font-medium">Location</h3>
                  <p className="text-xs text-gray-500">{event?.venue?.name}</p>
                  <p className="text-xs text-gray-500">
                    {event?.venue?.address}
                  </p>
                </div>
              </motion.div>
              
              <motion.div className="mt-8 space-y-3" variants={fadeUp}>
                <h3 className="text-sm font-semibold">Available Tickets</h3>
                <p className="text-xs text-gray-500">Choose a package</p>

                <div className="mt-3 p-3 overflow-y-auto rounded-xl">
                  {event?.packages?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-5">
                      {event.packages.map((p) => (
                        <motion.div
                          key={p.id}
                          onClick={() => setSelectedPackage(p)}
                          whileHover={{ scale: 1.03 }}
                          className={`relative cursor-pointer bg-white rounded-2xl shadow-sm flex h-30 transition-all overflow-hidden ${
                            selectedPackage?.id === p.id
                              ? "shadow-lg"
                              : "hover:shadow-md"
                          }`}
                        >
                          <div className="bg-[#FFB300] text-white px-2 flex items-center justify-center rounded-l-2xl">
                            <span className="[writing-mode:vertical-rl] rotate-180 font-bold tracking-wider text-[9px]">
                              {p.name}
                            </span>
                          </div>
                          
                          <div className="flex-grow px-3 py-2 flex flex-col">
                            <h4 className="text-sm font-semibold">
                              {formatCurrency(p.price, event.balance?.currency)}
                            </h4>

                            <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                              {p.description}
                            </p>
                            
                            <div className="mt-auto flex justify-end pt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBuyClick(p);
                                }}
                                className="bg-black text-white text-base px-3 py-1.5 rounded-full flex items-center gap-4"
                              >
                                Buy
                                <img src={arrowicon} className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="w-20 bg-gray-50 border-l border-gray-200 flex flex-col items-center justify-center dotted-edge p-3">
                            <div className="flex flex-col items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQty(p.id, "dec");
                                }}
                                className="px-2 py-0.5 rounded-full border border-gray-300 text-[12px]"
                              >
                                -
                              </button>

                              <span className="text-xs font-medium">
                                {quantities[p.id] ?? 1}
                              </span>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQty(p.id, "inc");
                                }}
                                className="px-2 py-0.5 rounded-full border border-gray-300 text-[12px]"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-300">
                      No tickets available.
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.aside>
          </div>
        </div>
      </motion.div>
      
      <motion.section
        className="mt-14"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={6}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Similar Events</h3>
            <p className="text-sm text-gray-500">
              You may also like some of the recommended events.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 border px-4 py-2 rounded-full"
          >
            <span>See more</span>
            <img src={arrowicon} alt="arrow" className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {events?.slice?.(0, 8)?.map((ev) => (
            <EventCard key={ev._id} event={ev} />
          ))}
        </div>
      </motion.section>
      
      <AnimatePresence>
        {checkoutVisible && selectedPackage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClose}
          >
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative bg-white w-full max-w-md mx-4 rounded-3xl p-6 shadow-2xl z-60"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold">Checkout</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Purchasing: <strong>{selectedPackage.name}</strong> –{" "}
                    {formatCurrency(
                      selectedPackage.price,
                      event.balance?.currency
                    )}
                  </p>
                </div>

                <button
                  onClick={() => setCheckoutVisible(false)}
                  className="text-gray-400"
                  aria-label="Close checkout"
                >
                  ✕
                </button>
              </div>

              {isAuthenticated ? (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700">Proceeding with your account:</p>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              ) : (
                <>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="p-3 bg-gray-100 rounded-xl focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="p-3 bg-gray-100 rounded-xl focus:outline-none"
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-4 p-3 bg-gray-100 rounded-xl focus:outline-none w-full"
                  />
                </>
              )}

              <button
                onClick={handlePay}
                disabled={isPurchasing}
                className="mt-5 w-full py-3 rounded-xl bg-black text-white font-medium disabled:opacity-60"
              >
                {isPurchasing ? "Processing..." : "Pay now"}
              </button>

              <button
                onClick={() => setCheckoutVisible(false)}
                className="mt-3 w-full text-sm text-center text-gray-600"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default EventDetailsPage;
