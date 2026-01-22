import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
);

const EventDetailsSkeleton = () => (
  <div className="relative w-full flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10">
    <div className="relative w-full lg:w-[60%] rounded-3xl overflow-hidden shadow-2xl mx-auto">
      <Skeleton className="w-full h-[50vh] sm:h-[60vh] lg:h-[80vh] rounded-3xl" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
        <Skeleton className="h-5 w-3/4 sm:w-2/3 mb-4" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    </div>

    <aside className="w-full bg-white h-fit">
      <Skeleton className="h-7 w-3/4 sm:w-2/3" />
      <Skeleton className="h-4 w-2/3 sm:w-1/2 mt-2" />
      <Skeleton className="h-4 w-full mt-6" />
      <Skeleton className="h-4 w-11/12 mt-2" />
      <Skeleton className="h-4 w-9/12 mt-2" />

      <div className="mt-6">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-2/3 mt-2" />
        <Skeleton className="h-3 w-3/4 mt-2" />
      </div>

      <div className="mt-8">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28 mt-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    </aside>
  </div>
);

const SimilarEventsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className="h-64 rounded-2xl" />
    ))}
  </div>
);

const getPkgId = (p) => p?.id || p?._id;

function EventDetailsPage() {
  const { selectedEvent, events, isLoading } = useSelector(
    (state) => state.event
  );

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const event = selectedEvent || {};
  const eventSlug = event?.slug;

  useGetEventByIdQuery(eventSlug, {
    skip: !eventSlug,
    refetchOnMountOrArgChange: true,
  });

  const shouldSkipEvents = Array.isArray(events) && events.length > 0;
  useGetEventsQuery(
    { page: 1, limit: 20, isPast: false, visible: true, isActive: true },
    { skip: shouldSkipEvents }
  );

  const [purchaseTicket, { isLoading: isPurchasing }] =
    usePurchaseTicketMutation();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [quantities, setQuantities] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    setSelectedPackage(null);
    setCheckoutVisible(false);
    setQuantities({});
    setFormData({ firstName: "", lastName: "", email: "" });
  }, [eventSlug]);

  const showEventSkeleton = isLoading || !eventSlug;

  const safeStartDate = useMemo(() => {
    if (!event?.start_date) return null;
    const d = new Date(event.start_date);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [event?.start_date]);

  const handleBuyClick = (pkg) => {
    setSelectedPackage(pkg);
    setCheckoutVisible(true);
  };

  const handleBackdropClose = (e) => {
    if (e.target === e.currentTarget) setCheckoutVisible(false);
  };

  const updateQty = (pkg, type) => {
    const id = getPkgId(pkg);
    if (!id) return;

    const available = Number(
      pkg.available ?? (pkg.quantity ?? 0) - (pkg.sold ?? 0)
    );

    setQuantities((prev) => {
      const current = prev[id] ?? 1;
      if (type === "inc") {
        const next =
          available > 0 ? Math.min(available, current + 1) : current + 1;
        return { ...prev, [id]: next };
      }
      if (type === "dec") return { ...prev, [id]: Math.max(1, current - 1) };
      return prev;
    });
  };

  const handlePay = async () => {
    if (!selectedPackage) return;
    if (!event?.slug) return handleErrorToast2("Event not ready yet.");

    const pkgId = getPkgId(selectedPackage);
    if (!pkgId) return handleErrorToast2("Invalid ticket package.");

    let name;
    let email;

    if (isAuthenticated) {
      name = user?.name;
      email = user?.email;
      if (!name || !email) {
        handleErrorToast2("Your account details are missing. Please re-login.");
        return;
      }
    } else {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      if (!fullName || !formData.email) {
        handleErrorToast2("Please enter full name and email");
        return;
      }
      name = fullName;
      email = formData.email;
    }

    const qty = quantities[pkgId] || 1;

    try {
      const res = await purchaseTicket({
        eventSlug: event.slug,
        package_id: pkgId,
        name,
        email,
        quantity: qty,
      }).unwrap();

      const paymentUrl = res?.data?.redirect_url;
      if (paymentUrl) window.open(paymentUrl, "_blank");
      else handleErrorToast2("No redirect URL found in response");
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
      className="min-h-screen px-4 sm:px-6 md:px-10 lg:px-20 xl:px-28 py-6 sm:py-8 bg-white"
    >
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="enter"
        exit="exit"
        className="py-2 bg-white flex justify-center"
      >
        <div className="w-full mx-auto">
          {showEventSkeleton ? (
            <EventDetailsSkeleton />
          ) : (
            <div className="relative w-full flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10">
              <motion.div
                className="relative w-full lg:w-[60%] rounded-3xl overflow-hidden shadow-2xl mx-auto"
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
                <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[80vh]">
                  <motion.img
                    src={event?.banner_url}
                    alt={event?.title || "Event banner"}
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
                    className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <h1 className="text-base sm:text-lg lg:text-lg font-[500] text-white drop-shadow-lg">
                      {event?.title}
                    </h1>

                    <motion.div
                      className="mt-3 sm:mt-4 flex items-center gap-3"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <img
                        src={event?.logo_url || event?.banner_url}
                        alt="Organizer logo"
                        className="h-10 w-10 rounded-full border border-white/20 object-cover shadow"
                      />
                      <div className="min-w-0">
                        <p className="text-xs text-white/60">Presented by</p>
                        <p className="text-sm text-white font-medium truncate">
                          {event?.merchantName || "Organizer"}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.aside
                className="w-full bg-white h-fit"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              >
                <motion.div variants={fadeUp}>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {event?.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {event?.category || "Event"} •{" "}
                    {safeStartDate ? safeStartDate.toLocaleString() : "TBA"}
                  </p>

                  <p className="mt-4 text-gray-600 text-sm leading-relaxed line-clamp-4 w-full">
                    {event?.description || "No description provided."}
                  </p>

                  <div className="mt-5">
                    <h3 className="text-sm font-medium">Location</h3>
                    <p className="text-xs text-gray-500">
                      {event?.venue?.name || "TBA"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event?.venue?.address || ""}
                    </p>
                  </div>
                </motion.div>

                <motion.div className="mt-8 space-y-3" variants={fadeUp}>
                  <h3 className="text-sm font-semibold">Available Tickets</h3>
                  <p className="text-xs text-gray-500">Choose a package</p>

                  <div className="mt-3 p-0 sm:p-3 overflow-y-auto rounded-xl">
                    {event?.packages?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {event.packages.map((p) => {
                          const id = getPkgId(p);
                          const available = Number(
                            p.available ?? (p.quantity ?? 0) - (p.sold ?? 0)
                          );
                          const isSoldOut = available <= 0;
                          const selectedId = getPkgId(selectedPackage);
                          const isSelected = selectedId && selectedId === id;

                          return (
                            <motion.div
                              key={id}
                              onClick={() => {
                                if (isSoldOut) return;
                                setSelectedPackage(p);
                              }}
                              whileHover={isSoldOut ? undefined : { scale: 1.03 }}
                              className={[
                                "relative rounded-2xl shadow-sm flex h-30 transition-all overflow-hidden",
                                isSoldOut
                                  ? "bg-gray-100 opacity-70 cursor-not-allowed grayscale"
                                  : "bg-white cursor-pointer",
                                isSelected && !isSoldOut
                                  ? "shadow-lg ring-2 ring-black/10"
                                  : "hover:shadow-md",
                              ].join(" ")}
                              aria-disabled={isSoldOut}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  if (!isSoldOut) setSelectedPackage(p);
                                }
                              }}
                            >
                              <div
                                className={[
                                  "text-white px-2 flex items-center justify-center rounded-l-2xl",
                                  isSoldOut ? "bg-gray-400" : "bg-[#FFB300]",
                                ].join(" ")}
                              >
                                <span className="[writing-mode:vertical-rl] rotate-180 font-bold tracking-wider text-[9px]">
                                  {p?.name}
                                </span>
                              </div>

                              <div className="flex-grow px-3 py-2 flex flex-col min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-sm font-semibold">
                                    {formatCurrency(
                                      p?.price,
                                      event?.balance?.currency
                                    )}
                                  </h4>

                                  <span
                                    className={[
                                      "text-[10px] px-2 py-1 rounded-full border whitespace-nowrap",
                                      isSoldOut
                                        ? "bg-gray-200 text-gray-600 border-gray-300"
                                        : "bg-green-50 text-green-700 border-green-200",
                                    ].join(" ")}
                                  >
                                    {isSoldOut
                                      ? "Sold out"
                                      : `${available} available`}
                                  </span>
                                </div>

                                <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                                  {p?.description}
                                </p>

                                <div className="mt-auto flex justify-end pt-1">
                                  <button
                                    disabled={isSoldOut}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isSoldOut) return;
                                      handleBuyClick(p);
                                    }}
                                    className={[
                                      "text-sm sm:text-base px-3 py-1.5 rounded-full flex items-center gap-4 transition",
                                      isSoldOut
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : "bg-black text-white hover:opacity-90",
                                    ].join(" ")}
                                  >
                                    {isSoldOut ? "Sold out" : "Buy"}
                                    {!isSoldOut && (
                                      <img
                                        src={arrowicon}
                                        alt="arrow"
                                        className="h-5 w-5"
                                      />
                                    )}
                                  </button>
                                </div>
                              </div>

                              <div
                                className={[
                                  "w-20 border-l flex flex-col items-center justify-center dotted-edge p-3",
                                  isSoldOut
                                    ? "bg-gray-100 border-gray-200"
                                    : "bg-gray-50 border-gray-200",
                                ].join(" ")}
                              >
                                <div className="flex flex-col items-center gap-1">
                                  <button
                                    disabled={isSoldOut}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isSoldOut) return;
                                      updateQty(p, "dec");
                                    }}
                                    className={[
                                      "px-2 py-0.5 rounded-full border text-[12px] transition",
                                      isSoldOut
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                        : "border-gray-300 hover:bg-white",
                                    ].join(" ")}
                                  >
                                    -
                                  </button>

                                  <span className="text-xs font-medium">
                                    {quantities[id] ?? 1}
                                  </span>

                                  <button
                                    disabled={isSoldOut}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isSoldOut) return;
                                      updateQty(p, "inc");
                                    }}
                                    className={[
                                      "px-2 py-0.5 rounded-full border text-[12px] transition",
                                      isSoldOut
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                        : "border-gray-300 hover:bg-white",
                                    ].join(" ")}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-300">No tickets available.</p>
                    )}
                  </div>
                </motion.div>
              </motion.aside>
            </div>
          )}
        </div>
      </motion.div>

      <motion.section
        className="mt-10 sm:mt-14"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={6}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold">Similar Events</h3>
            <p className="text-sm text-gray-500">
              You may also like some of the recommended events.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center justify-center gap-2 border px-4 py-2 rounded-full w-full sm:w-auto"
          >
            <span>See more</span>
            <img src={arrowicon} alt="arrow" className="h-5 w-5" />
          </Link>
        </div>

        {isLoading && (!Array.isArray(events) || events.length === 0) ? (
          <SimilarEventsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
            {events?.slice?.(0, 8)?.map((ev) => (
              <EventCard key={ev._id} event={ev} />
            ))}
          </div>
        )}
      </motion.section>

      <AnimatePresence>
        {checkoutVisible && selectedPackage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
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
              className="relative bg-white w-full sm:max-w-md mx-0 sm:mx-4 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl z-[60]"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <h4 className="text-lg font-semibold">Checkout</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Purchasing: <strong>{selectedPackage?.name}</strong> –{" "}
                    {formatCurrency(
                      selectedPackage?.price,
                      event?.balance?.currency
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
                  <p className="text-sm text-gray-700">
                    Proceeding with your account:
                  </p>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              ) : (
                <>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          firstName: e.target.value,
                        }))
                      }
                      className="p-3 bg-gray-100 rounded-xl focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, lastName: e.target.value }))
                      }
                      className="p-3 bg-gray-100 rounded-xl focus:outline-none"
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
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
