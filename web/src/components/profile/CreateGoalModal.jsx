import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../../shared/components/ui/Button";
import Input from "../../shared/components/ui/Input";
import { handleSuccessToast2, handleErrorToast2 } from "../../utils/toasts";
import { useCreateSavingsGoalMutation, useGetAvailableOrganizersQuery } from "../../features/wallet/walletApiSlice";
import logo from "../../assets/logo/UlinzingaUlinzinga-2.png";

const steps = ["Goal Type", "Selection", "Target & Settings"];

export default function CreateGoalModal({
  isOpen,
  onClose,
  events,
  goalFormData,
  setGoalFormData,
  detailedEvent,
  isCreatingGoal,
}) {
  if (!isOpen) return null;

  const [createSavingsGoal] = useCreateSavingsGoalMutation();
  const { data: organizersData } = useGetAvailableOrganizersQuery();

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const e = {};

    if (step === 0) {
      if (!goalFormData.savingType) e.savingType = "Please select a saving type";
    }

    if (step === 1) {
      if (goalFormData.savingType === "organizer") {
        if (!goalFormData.organizerId) e.organizerId = "Please select an organizer";
      } else {
        if (!goalFormData.event_slug) e.event_slug = "Please select an event";
        if ((goalFormData.savingType === "ticket_inclusive" || goalFormData.savingType === "complete_event") && !goalFormData.ticketTypeId) {
          e.ticketTypeId = "Please select a ticket type";
        }
      }
    }

    if (step === 2) {
      if (!goalFormData.targetAmount || parseFloat(goalFormData.targetAmount) <= 0) {
        e.targetAmount = "Target amount must be greater than 0";
      }
      if (!goalFormData.targetDate) e.targetDate = "Please select a target date";
      if (goalFormData.ticketQuantity && (goalFormData.ticketQuantity < 1 || goalFormData.ticketQuantity > 20)) {
        e.ticketQuantity = "Ticket quantity must be between 1 and 20";
      }
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
    setGoalFormData({
      event_slug: "",
      savingType: "ticket_inclusive",
      ticketTypeId: "",
      targetAmount: "",
      targetDate: "",
      ticketQuantity: 1,
      additionalSpending: 0,
      organizerId: "",
      priority: "medium",
      reminderDays: 3,
      isAutoPurchase: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      const goalData = {
        ...goalFormData,
        targetAmount: parseFloat(goalFormData.targetAmount),
        ticketQuantity: goalFormData.ticketQuantity || 1,
      };

      await createSavingsGoal(goalData).unwrap();

      handleSuccessToast2("Savings goal created successfully!");
      handleClose();
    } catch (error) {
      handleErrorToast2(error?.data?.message || "Failed to create savings goal");
    }
  };

  const calculateTotalAmount = () => {
    if ((goalFormData.savingType === "ticket_inclusive" || goalFormData.savingType === "complete_event") && detailedEvent?.packages) {
      const selectedTicketType = detailedEvent.packages.find(t => t.id === goalFormData.ticketTypeId);
      if (selectedTicketType && goalFormData.ticketQuantity) {
        const ticketAmount = selectedTicketType.price * goalFormData.ticketQuantity;
        if (goalFormData.savingType === "complete_event") {
          return ticketAmount + (goalFormData.additionalSpending || 0);
        }
        return ticketAmount;
      }
    }
    return goalFormData.targetAmount || 0;
  };

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setGoalFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
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
              <p className="text-xs text-gray-500">Create</p>
              <h3 className="text-lg font-semibold">
                Savings <span className="text-[#FFB300]">Goal</span>
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
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Saving Type
              </label>
              
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="savingType"
                  value="ticket_inclusive"
                  checked={goalFormData.savingType === "ticket_inclusive"}
                  onChange={handleInputChange}
                  className="mt-1 text-[#FFB300] focus:ring-[#FFB300]"
                />
                <div>
                  <div className="font-medium text-gray-900">Ticket Savings</div>
                  <div className="text-sm text-gray-500">
                    Save for event tickets. Auto-calculates total based on quantity selected.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="savingType"
                  value="ticket_exclusive"
                  checked={goalFormData.savingType === "ticket_exclusive"}
                  onChange={handleInputChange}
                  className="mt-1 text-[#FFB300] focus:ring-[#FFB300]"
                />
                <div>
                  <div className="font-medium text-gray-900">Event Spending</div>
                  <div className="text-sm text-gray-500">
                    Save for additional expenses (food, drinks, transportation). You already have tickets.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="savingType"
                  value="complete_event"
                  checked={goalFormData.savingType === "complete_event"}
                  onChange={handleInputChange}
                  className="mt-1 text-[#FFB300] focus:ring-[#FFB300]"
                />
                <div>
                  <div className="font-medium text-gray-900">Complete Event Budget</div>
                  <div className="text-sm text-gray-500">
                    Save for both tickets and additional spending in one goal.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="savingType"
                  value="organizer"
                  checked={goalFormData.savingType === "organizer"}
                  onChange={handleInputChange}
                  className="mt-1 text-[#FFB300] focus:ring-[#FFB300]"
                />
                <div>
                  <div className="font-medium text-gray-900">Pre-Event Organizer Funding</div>
                  <div className="text-sm text-gray-500">
                    Save funds under your favorite organizers for future events.
                  </div>
                </div>
              </label>

              {errors.savingType && (
                <p className="text-red-500 text-sm mt-1">{errors.savingType}</p>
              )}
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-4">
              {goalFormData.savingType !== "organizer" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Event
                    </label>
                    <select
                      name="event_slug"
                      value={goalFormData.event_slug}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
                    >
                      <option value="">Choose an event...</option>
                      {events?.map((event) => (
                        <option key={event.slug} value={event.slug}>
                          {event.title} - {new Date(event.start_date).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                    {errors.event_slug && (
                      <p className="text-red-500 text-sm mt-1">{errors.event_slug}</p>
                    )}
                  </div>

                  {(goalFormData.savingType === "ticket_inclusive" || goalFormData.savingType === "complete_event") && goalFormData.event_slug && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Ticket Type
                      </label>
                      <select
                        name="ticketTypeId"
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
                              ? parseFloat(selectedTicketType.price * (goalFormData.ticketQuantity || 1) + (goalFormData.additionalSpending || 0)).toString()
                              : "",
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
                      >
                        <option value="">Choose ticket type...</option>
                        {detailedEvent?.packages?.map((ticketType) => (
                          <option key={ticketType.id} value={ticketType.id}>
                            {ticketType.name} - MWK {ticketType.price.toLocaleString()}
                          </option>
                        ))}
                      </select>
                      {errors.ticketTypeId && (
                        <p className="text-red-500 text-sm mt-1">{errors.ticketTypeId}</p>
                      )}
                    </div>
                  )}

                  {(goalFormData.savingType === "ticket_inclusive" || goalFormData.savingType === "complete_event") && goalFormData.ticketTypeId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Tickets
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          name="ticketQuantity"
                          min="1"
                          max="20"
                          value={goalFormData.ticketQuantity || 1}
                          onChange={(e) => {
                            const quantity = parseInt(e.target.value) || 1;
                            const ticketTypes = detailedEvent?.packages || [];
                            const selectedTicketType = ticketTypes.find(
                              (t) => t.id === goalFormData.ticketTypeId
                            );
                            
                            setGoalFormData({
                              ...goalFormData,
                              ticketQuantity: quantity,
                              targetAmount: selectedTicketType?.price
                                ? parseFloat(selectedTicketType.price * quantity + (goalFormData.additionalSpending || 0)).toString()
                                : "",
                            });
                          }}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
                        />
                        <span className="text-sm text-gray-500">
                          Total: MWK {calculateTotalAmount().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {goalFormData.savingType === "complete_event" && goalFormData.ticketTypeId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Event Spending (MWK)
                      </label>
                      <input
                        type="number"
                        name="additionalSpending"
                        value={goalFormData.additionalSpending || 0}
                        onChange={(e) => {
                          const additionalSpending = parseFloat(e.target.value) || 0;
                          const ticketTypes = detailedEvent?.packages || [];
                          const selectedTicketType = ticketTypes.find(
                            (t) => t.id === goalFormData.ticketTypeId
                          );
                          
                          setGoalFormData({
                            ...goalFormData,
                            additionalSpending,
                            targetAmount: selectedTicketType?.price
                              ? parseFloat(selectedTicketType.price * (goalFormData.ticketQuantity || 1) + additionalSpending).toString()
                              : "",
                          });
                        }}
                        placeholder="Enter additional spending amount"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
                        min="0"
                        step="100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        For food, drinks, parking, merchandise, etc.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Organizer
                  </label>
                  <select
                    name="organizerId"
                    value={goalFormData.organizerId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
                  >
                    <option value="">Choose an organizer...</option>
                    {organizersData?.data?.map((organizer) => (
                      <option key={organizer.id} value={organizer.id}>
                        {organizer.name} ({organizer.email})
                      </option>
                    ))}
                  </select>
                  {errors.organizerId && (
                    <p className="text-red-500 text-sm mt-1">{errors.organizerId}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-full">
                  <Input
                    label="Target Amount (MWK)"
                    name="targetAmount"
                    type="number"
                    value={goalFormData.targetAmount}
                    onChange={handleInputChange}
                    error={errors.targetAmount}
                    min="1"
                    step="0.01"
                    readOnly={(goalFormData.savingType === "ticket_inclusive" || goalFormData.savingType === "complete_event") && goalFormData.ticketTypeId}
                  />
                  {(goalFormData.savingType === "ticket_inclusive" || goalFormData.savingType === "complete_event") && goalFormData.ticketTypeId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Amount auto-calculated based on {goalFormData.savingType === "complete_event" ? "tickets + additional spending" : "ticket quantity"}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <Input
                    label="Target Date"
                    name="targetDate"
                    type="date"
                    value={goalFormData.targetDate}
                    onChange={handleInputChange}
                    error={errors.targetDate}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={goalFormData.priority || "medium"}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <Input
                    label="Reminder Days Before"
                    name="reminderDays"
                    type="number"
                    min="1"
                    max="30"
                    value={goalFormData.reminderDays || 3}
                    onChange={(e) =>
                      setGoalFormData({
                        ...goalFormData,
                        reminderDays: parseInt(e.target.value) || 3,
                      })
                    }
                  />
                </div>
              </div>

              {(goalFormData.savingType === "ticket_inclusive" || goalFormData.savingType === "complete_event") && (
                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={goalFormData.isAutoPurchase || false}
                      onChange={(e) =>
                        setGoalFormData({
                          ...goalFormData,
                          isAutoPurchase: e.target.checked,
                        })
                      }
                      className="text-[#FFB300] focus:ring-[#FFB300]"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        Auto-purchase tickets when goal is met
                      </div>
                      <div className="text-sm text-gray-500">
                        Automatically purchase tickets as soon as your savings goal is completed
                      </div>
                    </div>
                  </label>
                </div>
              )}
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
              <Button type="submit" loading={isCreatingGoal}>
                Create Goal
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
