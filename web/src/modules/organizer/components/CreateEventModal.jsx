import React, { useState } from "react";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import ImagePicker from "@/shared/components/ui/ImagePicker";
import MapPicker from "@/shared/components/ui/MapPicker";
import { useCreateOrganizerEventMutation } from "@/features/organizer-events/organizerEventsApiSlice";
import { useDispatch } from "react-redux";
import { addEvent } from "@/features/organizer-events/organizerEventsSlice";
import { handleSuccessToast2, handleErrorToast2 } from "../../../utils/toasts";
import logo from "@/assets/logo/UlinzingaUlinzinga-2.png";

const steps = ["Basic Info", "Venue & Media", "Settings", "Interests"];

const CreateEventModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const dispatch = useDispatch();
  const [createEvent, { isLoading }] = useCreateOrganizerEventMutation();

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue_name: "",
    venue_address: "",
    location: "", // Will be replaced with coordinates object
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    logo: null, // File object
    banner: null, // File object
    interest: [],
    capacity: "",
    balance_ref: "",
    terms_text: "",
    isVisible: false,
  });

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleLocationChange = (locationData) => {
    setFormData((prev) => ({ ...prev, location: locationData }));
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: null }));
    }
  };

  const handleLogoChange = (file) => {
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleBannerChange = (file) => {
    setFormData((prev) => ({ ...prev, banner: file }));
  };

  const validateStep = () => {
    console.log("Validating step:", step);
    console.log("FormData:", formData);
    const e = {};

    if (step === 0) {
      if (!formData.title.trim()) e.title = "Required";
      if (!formData.description.trim()) e.description = "Required";
    }

    if (step === 1) {
      if (!formData.venue_name.trim()) e.venue_name = "Required";
      if (!formData.location) e.location = "Required";
      if (!formData.start_date) e.start_date = "Required";
      if (
        formData.start_date &&
        formData.end_date &&
        new Date(formData.start_date) >= new Date(formData.end_date)
      ) {
        e.end_date = "End date must be after start date";
      }
    }

    if (step === 2) {
      if (!formData.balance_ref.trim()) e.balance_ref = "Required";
    }

    console.log("Validation errors:", e);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    const isValid = validateStep();
    console.log("handleNext: isValid =", isValid);
    if (isValid) {
      setStep((s) => s + 1);
    }
  };
  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        // Convert location object to string for backend compatibility
        location: formData.location
          ? typeof formData.location === "string"
            ? formData.location
            : `${
                formData.location.address ||
                `${formData.location.lat}, ${formData.location.lng}`
              }`
          : "",
      };

      const res = await createEvent(submitData).unwrap();

      dispatch(addEvent(res.data));
      handleSuccessToast2("Event created successfully!");
      onClose();
      onSuccess?.(res.data);
    } catch (err) {
      handleErrorToast2(err?.data?.message || "Failed to create event");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
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
                New <span className="text-[#FFB300]">Event</span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
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
        
        <form onSubmit={handleSubmit} className="px-6 py-6 ">
          {step === 0 && (
            <>
              <Input
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={errors.title}
              />

              <Input
                label="Description"
                name="description"
                multiline
                value={formData.description}
                onChange={handleInputChange}
                error={errors.description}
              />

              <div className="flex gap-4">
                <Input
                  label="Start Date"
                  name="start_date"
                  type="date"
                  className="w-full"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  error={errors.start_date}
                />

                <Input
                  label="End Date"
                  name="end_date"
                  type="date"
                  className="w-full"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  error={errors.end_date}
                />
              </div>

              <div className="flex gap-4">
                <Input
                  label="Start Time"
                  name="start_time"
                  type="time"
                  className="w-full"
                  value={formData.start_time}
                  onChange={handleInputChange}
                />

                <Input
                  label="End Time"
                  name="end_time"
                  type="time"
                  className="w-full"
                  value={formData.end_time}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                <ImagePicker
                  label="Event Logo"
                  value={formData.logo}
                  onChange={handleLogoChange}
                  accept="image/*"
                  maxSize={2 * 1024 * 1024}
                />

                <ImagePicker
                  label="Event Banner"
                  value={formData.banner}
                  onChange={handleBannerChange}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024}
                />
              </div>

              <div className="flex gap-4">
                <Input
                  label="Venue Name"
                  name="venue_name"
                  className="w-full"
                  value={formData.venue_name}
                  onChange={handleInputChange}
                  error={errors.venue_name}
                />

                <Input
                  label="Venue Address"
                  name="venue_address"
                  className="w-full"
                  value={formData.venue_address}
                  onChange={handleInputChange}
                />
              </div>

              <MapPicker
                label="Event Location"
                value={formData.location}
                onChange={handleLocationChange}
                error={errors.location}
                height="200px"
              />
            </>
          )}

          {step === 2 && (
            <>
              <Input
                label="Balance Reference"
                name="balance_ref"
                value={formData.balance_ref}
                onChange={handleInputChange}
                error={errors.balance_ref}
              />

              <Input
                label="Terms & Conditions"
                name="terms_text"
                multiline
                value={formData.terms_text}
                onChange={handleInputChange}
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      isVisible: e.target.checked,
                    }))
                  }
                />
                Make event public
              </label>
            </>
          )}

          {step === 3 && (
            <Input
              label="Interests"
              placeholder="music, tech, business"
              value={formData.interest.join(", ")}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  interest: e.target.value
                    .split(",")
                    .map((i) => i.trim())
                    .filter(Boolean),
                }))
              }
            />
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4">
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
              <Button type="submit" loading={isLoading}>
                Create Event
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
