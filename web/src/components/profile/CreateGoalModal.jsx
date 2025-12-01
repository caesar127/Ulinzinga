import { motion } from "framer-motion";
import Modal from "../../shared/components/ui/Modal";

export default function CreateGoalModal({
  isOpen,
  onClose,
  events,
  goalFormData,
  setGoalFormData,
  upcomingData,
  detailedEvent,
  handleConfirmCreateGoal,
  isCreatingGoal,
}) {
  const handleClose = () => {
    onClose();
    setGoalFormData({
      event_slug: "",
      savingType: "ticket_inclusive",
      ticketTypeId: "",
      targetAmount: "",
      targetDate: "",
    });
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Event Savings Goal"
      size="md"
    >
      <div className="space-y-6">
        {/* Event Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Event
          </label>
          <select
            value={goalFormData.event_slug}
            onChange={(e) =>
              setGoalFormData({ ...goalFormData, event_slug: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
          >
            <option value="">Choose an event...</option>
            {events?.map((event) => (
              <option key={event.slug} value={event.slug}>
                {event.title} - {new Date(event.start_date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* Saving Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Saving Type
          </label>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="savingType"
                value="ticket_inclusive"
                checked={goalFormData.savingType === "ticket_inclusive"}
                onChange={(e) =>
                  setGoalFormData({
                    ...goalFormData,
                    savingType: e.target.value,
                  })
                }
                className="mt-1 text-[#FFB300] focus:ring-[#FFB300]"
              />
              <div>
                <div className="font-medium text-gray-900">Ticket Inclusive</div>
                <div className="text-sm text-gray-500">
                  Save for the full event ticket price. Goal must be reached
                  before tickets sell out.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="savingType"
                value="ticket_exclusive"
                checked={goalFormData.savingType === "ticket_exclusive"}
                onChange={(e) =>
                  setGoalFormData({
                    ...goalFormData,
                    savingType: e.target.value,
                  })
                }
                className="mt-1 text-[#FFB300] focus:ring-[#FFB300]"
              />
              <div>
                <div className="font-medium text-gray-900">
                  Ticket Exclusive
                </div>
                <div className="text-sm text-gray-500">
                  Save for additional expenses (food, drinks, transportation).
                  You already have a ticket.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Ticket Type Selection - Only show for ticket inclusive */}
        {goalFormData.savingType === "ticket_inclusive" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Ticket Type
            </label>
            <select
              value={goalFormData.ticketTypeId}
              onChange={(e) => {
                const selectedTicketTypeId = e.target.value;
                const ticketTypes = detailedEvent?.packages || [];
                const selectedTicketType = ticketTypes.find(
                  (t) => t.id === selectedTicketTypeId
                );

                setGoalFormData({
                  ...goalFormData,
                  ticketTypeId: selectedTicketTypeId,
                  targetAmount: selectedTicketType?.price
                    ? parseFloat(selectedTicketType.price).toString()
                    : "",
                });
              }}
              disabled={!goalFormData.event_slug}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {!goalFormData.event_slug
                  ? "Select an event first..."
                  : "Choose ticket type..."}
              </option>
              {goalFormData.event_slug &&
                detailedEvent?.packages?.map((ticketType) => (
                  <option key={ticketType.id} value={ticketType.id}>
                    {ticketType.name} - MWK{" "}
                    {ticketType.price.toLocaleString()}
                    {ticketType.description && ` (${ticketType.description})`}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="flex gap-4 justify-between">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Amount (MWK)
            </label>
            <input
              type="number"
              value={goalFormData.targetAmount}
              onChange={(e) =>
                setGoalFormData({
                  ...goalFormData,
                  targetAmount: e.target.value,
                })
              }
              placeholder="Enter target amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
              min="1"
              step="0.01"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Date
            </label>
            <input
              type="date"
              value={goalFormData.targetDate}
              onChange={(e) =>
                setGoalFormData({
                  ...goalFormData,
                  targetDate: e.target.value,
                })
              }
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirmCreateGoal}
            disabled={
              !goalFormData.event_slug ||
              !goalFormData.targetAmount ||
              !goalFormData.targetDate ||
              (goalFormData.savingType === "ticket_inclusive" &&
                !goalFormData.ticketTypeId) ||
              isCreatingGoal
            }
            className="flex-1 bg-[#FFB300] text-black py-3 rounded-xl font-semibold hover:bg-[#e0a200] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingGoal ? "Creating..." : "Create Goal"}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}