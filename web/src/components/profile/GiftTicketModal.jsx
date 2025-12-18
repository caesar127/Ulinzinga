import React, { useState } from "react";
import Button from "../../shared/components/ui/Button";
import Input from "../../shared/components/ui/Input";
import logo from "../../assets/logo/UlinzingaUlinzinga-2.png";

const steps = ["Select Event", "Choose Recipient", "Review & Send"];

export default function GiftTicketModal({
  isOpen,
  onClose,
  events,
  connections,
  giftTicketData,
  setGiftTicketData,
  handleConfirmGiftTicket,
  isGiftingTicket,
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const selectedEvent = events?.find(e => e.slug === giftTicketData.selectedEvent);
  const ticketTypes = selectedEvent?.packages || [];

  const validateStep = () => {
    const e = {};

    if (step === 0) {
      if (!giftTicketData.selectedEvent) e.selectedEvent = "Please select an event";
      if (!giftTicketData.selectedTicketType) e.selectedTicketType = "Please select a ticket type";
    }

    if (step === 1) {
      if (!giftTicketData.selectedConnection) e.selectedConnection = "Please select a recipient";
      if (!giftTicketData.quantity || giftTicketData.quantity < 1) e.quantity = "Quantity must be at least 1";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => validateStep() && setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleClose = () => {
    onClose();
    setStep(0);
    setErrors({});
    setGiftTicketData({
      selectedEvent: "",
      selectedTicketType: "",
      selectedConnection: "",
      quantity: 1,
      giftMessage: "",
    });
  };

  const handleEventChange = (eventSlug) => {
    setGiftTicketData({
      ...giftTicketData,
      selectedEvent: eventSlug,
      selectedTicketType: "",
    });
    if (errors.selectedEvent) {
      setErrors((prev) => ({ ...prev, selectedEvent: null }));
    }
  };

  const handleConnectionChange = (connectionId) => {
    const selectedConnection = connections?.find(c => c._id === connectionId);
    setGiftTicketData({
      ...giftTicketData,
      selectedConnection: connectionId,
      recipientName: selectedConnection?.name || "",
      recipientEmail: selectedConnection?.email || "",
    });
    if (errors.selectedConnection) {
      setErrors((prev) => ({ ...prev, selectedConnection: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    handleConfirmGiftTicket();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mx-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-12" />
            <div>
              <p className="text-xs text-gray-500">Gift a</p>
              <h3 className="text-lg font-semibold">
                Event <span className="text-[#FFB300]">Ticket</span>
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-2xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <div className="px-6 pt-4">
          <div className="flex justify-between bg-gray-100 rounded-full p-2">
            {steps.map((label, i) => (
              <div
                key={label}
                className={`flex-1 text-center text-xs p-2 rounded-full transition ${
                  i === step ? "bg-black text-white" : "text-gray-500"
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-6">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Event
                </label>
                <select
                  value={giftTicketData.selectedEvent}
                  onChange={(e) => handleEventChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
                >
                  <option value="">Choose an event</option>
                  {events?.map((event) => (
                    <option key={event.slug} value={event.slug}>
                      {event.title || event.name}
                    </option>
                  ))}
                </select>
                {errors.selectedEvent && (
                  <p className="text-red-500 text-sm mt-1">{errors.selectedEvent}</p>
                )}
              </div>

              {giftTicketData.selectedEvent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Type
                  </label>
                  <select
                    value={giftTicketData.selectedTicketType}
                    onChange={(e) => {
                      setGiftTicketData({
                        ...giftTicketData,
                        selectedTicketType: e.target.value
                      });
                      if (errors.selectedTicketType) {
                        setErrors((prev) => ({ ...prev, selectedTicketType: null }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
                  >
                    <option value="">Choose ticket type</option>
                    {ticketTypes.map((ticketType) => (
                      <option key={ticketType.id} value={ticketType.slug}>
                        {ticketType.name} - MWK {ticketType.price?.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  {errors.selectedTicketType && (
                    <p className="text-red-500 text-sm mt-1">{errors.selectedTicketType}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gift to Connection
                </label>
                <select
                  value={giftTicketData.selectedConnection}
                  onChange={(e) => handleConnectionChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
                >
                  <option value="">Choose a connection</option>
                  {connections?.map((connection) => (
                    <option key={connection._id} value={connection._id}>
                      {connection.name} @{connection.username}
                    </option>
                  ))}
                </select>
                {errors.selectedConnection && (
                  <p className="text-red-500 text-sm mt-1">{errors.selectedConnection}</p>
                )}
              </div>

              <div>
                <Input
                  label="Quantity"
                  type="number"
                  value={giftTicketData.quantity}
                  onChange={(e) => setGiftTicketData({
                    ...giftTicketData,
                    quantity: parseInt(e.target.value) || 1
                  })}
                  min="1"
                  max="10"
                  error={errors.quantity}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={giftTicketData.giftMessage}
                  onChange={(e) => setGiftTicketData({
                    ...giftTicketData,
                    giftMessage: e.target.value
                  })}
                  placeholder="Add a personal message to your gift..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Gift Summary</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Event:</span>
                    <span>{selectedEvent?.title || selectedEvent?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Ticket:</span>
                    <span>{ticketTypes.find(t => t.slug === giftTicketData.selectedTicketType)?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Quantity:</span>
                    <span>{giftTicketData.quantity}</span>
                  </div>
                  {giftTicketData.selectedConnection && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium">Recipient:</span>
                      <span>{giftTicketData.recipientName}</span>
                    </div>
                  )}
                  {giftTicketData.giftMessage && (
                    <div className="py-2">
                      <span className="font-medium block mb-1">Message:</span>
                      <p className="text-gray-500 italic">"{giftTicketData.giftMessage}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  By clicking "Gift Ticket", you confirm that you want to purchase and send this ticket as a gift.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-between pt-4 sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4 mt-6">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={handlePrev}>
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < steps.length - 1 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" loading={isGiftingTicket}>
                Gift Ticket
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
