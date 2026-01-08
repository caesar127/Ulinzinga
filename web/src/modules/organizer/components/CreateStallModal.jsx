import React, { useState } from "react";
import Modal from "@/shared/components/ui/Modal";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import { useDispatch } from "react-redux";
import { handleSuccessToast2, handleErrorToast2 } from "../../../utils/toasts";
import { useCreateStallSetupMutation } from "@/features/stalls/stallsApiSlice";

const steps = ["Basic Info", "Pricing & Type", "Media"];

const CreateStallModal = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [createStall, { isLoading }] = useCreateStallSetupMutation();

  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    size: "medium",
    price: "",
    vendor_limit: "",
  });

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [errors, setErrors] = useState({});

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    setBannerFile(file);
    setBannerPreview(file ? URL.createObjectURL(file) : null);
  };

  const nextStep = () => setStep((s) => Math.min(2, s + 1));
  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  const validateStep = () => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = "Stall name is required";
      if (!formData.description.trim())
        newErrors.description = "Description is required";
    }

    if (step === 1) {
      if (!formData.price.trim()) newErrors.price = "Price is required";
      if (isNaN(formData.price)) newErrors.price = "Price must be numeric";
      if (!formData.vendor_limit.trim())
        newErrors.vendor_limit = "Vendor limit required";
    }

    if (step === 2) {
      if (!bannerFile) newErrors.banner = "Banner required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    nextStep();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        vendor_limit: parseInt(formData.vendor_limit),
        banner: bannerFile,
      };

      const res = await createStall(payload).unwrap();

      if (res?.data) {
        handleSuccessToast2("Stall created successfully!");
        onClose();
        if (onSuccess) onSuccess(res.data);
      }
    } catch (err) {
      handleErrorToast2(err?.data?.message || "Failed to create stall.");
    }
  };

  const progressPercent = ((step + 1) / steps.length) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Stall" size="lg">
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          {steps.map((label, i) => (
            <span
              key={i}
              className={`${i === step ? "text-blue-600 font-semibold" : ""}`}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {step === 0 && (
          <div className="space-y-6 animate-fadeIn">
            <Input
              label="Stall Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
            />

            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              textarea
              error={errors.description}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="text-sm mb-1 block font-medium text-gray-700">
                Stall Size
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <Input
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              error={errors.price}
            />

            <Input
              label="Vendor Limit"
              name="vendor_limit"
              value={formData.vendor_limit}
              onChange={handleInputChange}
              error={errors.vendor_limit}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Stall Banner
              </label>
              <input type="file" onChange={handleFileInput} />
              {errors.banner && (
                <p className="text-red-500 text-xs mt-1">{errors.banner}</p>
              )}
            </div>

            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-md border"
              />
            )}
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 0 ? (
            <Button variant="ghost" onClick={prevStep} type="button">
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < steps.length - 1 ? (
            <Button onClick={handleNext} type="button">
              Next
            </Button>
          ) : (
            <Button type="submit" loading={isLoading}>
              Create Stall
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default CreateStallModal;
