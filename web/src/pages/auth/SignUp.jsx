import React, { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  useUserSignupMutation,
  useUpdateUserInterestsMutation,
} from "../../features/auth/authApiSlice";
import { useGetCategoriesQuery } from "../../features/category/categoryApiSlice";
import { handleSuccessToast2, handleErrorToast2 } from "../../utils/toasts";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import logoIcon from "../../assets/logo/UlinzingaUlinzinga-2.png";
import arrowicon from "../../assets/icons/arrowicon.svg";

const steps = ["Onboarding", "Sign Up", "Interests"];

function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [step, setStep] = useState(0);
  const [merchantRole, setMerchantRole] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const [userSignup, { isLoading: isSigningUp }] = useUserSignupMutation();
  const [updateUserInterests, { isLoading: isUpdatingInterests }] =
    useUpdateUserInterestsMutation();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const roles = [
    { key: "user", label: "Attendee" },
    { key: "organizer", label: "Organizer" },
    { key: "vendor", label: "Vendor" },
  ];

  useEffect(() => {
    const role = searchParams.get("role");
    if (role) {
      setMerchantRole(role);
      if (role === "user") {
        setStep(1);
      }
    }
  }, [searchParams]);

  const toggleInterest = (categoryId) => {
    setSelectedInterests((prev) =>
      prev.includes(categoryId)
        ? prev.filter((item) => item !== categoryId)
        : [...prev, categoryId]
    );
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleRoleSelection = () => {
    if (!merchantRole) {
      handleErrorToast2("Please select who best describes you.");
      return;
    }

    if (merchantRole === "user") {
      setStep(step + 1);
    } else {
      navigate(`/signup?role=${merchantRole}`);
    }
  };
  
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      handleErrorToast2("Please fix the errors in the form");
      return;
    }

    try {
      const result = await userSignup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.username,
      }).unwrap();

      handleSuccessToast2("Account created successfully!");
      setStep(step + 1);
    } catch (error) {
      console.error("Signup error:", error);
      handleErrorToast2(error.data?.message || "Failed to create account");
    }
  };
  
  const handleInterestsComplete = async () => {
    if (selectedInterests.length === 0) {
      handleErrorToast2("Please select at least one interest");
      return;
    }

    try {
      const userId = user?.id || user?._id;
      if (!userId) {
        handleErrorToast2("User session not found");
        return;
      }

      await updateUserInterests({
        userId: userId,
        interests: selectedInterests,
      }).unwrap();

      handleSuccessToast2("Profile setup complete!");
      navigate("/");
    } catch (error) {
      console.error("Interests update error:", error);
      handleErrorToast2(error.data?.message || "Failed to save interests");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 w-full flex flex-col items-center">
        <div className="flex items-top">
          {steps.map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    index <= step ? "bg-[#FFB300]" : "bg-gray-300"
                  }`}
                ></div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-52 h-px  ${
                    index < step ? "bg-[#FFB300]" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <img src={logoIcon} alt="Logo" className="h-16 mb-3" />

      {/* Step 0: Role Selection */}
      {step === 0 && (
        <>
          <h1 className="text-xl font-[500] mb-2">What best describes you?</h1>
          <span className="text-sm text-[#949494]">
            Turn your unused tickets into someone else's experience
          </span>

          <div className="mt-9 flex flex-col gap-3 w-full max-w-sm">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => setMerchantRole(role.key)}
                className={`py-3 px-4 text-sm border rounded-lg transition ${
                  merchantRole === role.key
                    ? "bg-[#FFB300] text-white border-transparent"
                    : "bg-[#F3F3F3] text-[#535353] border-black/10"
                }`}
              >
                {role.label}
              </button>
            ))}

            <button
              onClick={handleRoleSelection}
              disabled={isSigningUp}
              className="bg-black disabled:opacity-50 text-sm text-white px-4 py-4 rounded-lg 
             flex items-center justify-center w-full max-w-sm mt-5 relative"
            >
              <span>{isSigningUp ? "Loading..." : "Continue"}</span>
              {!isSigningUp && (
                <img
                  src={arrowicon}
                  alt="arrow"
                  className="h-6 w-6 absolute right-4"
                />
              )}
            </button>

            <p className="text-sm text-center text-[#949494] mt-3">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/signin")}
                className="text-[#FFB300] cursor-pointer"
              >
                Sign In
              </span>
            </p>
          </div>
        </>
      )}

      {/* Step 1: Sign Up Form */}
      {step === 1 && (
        <>
          <h1 className="text-xl font-medium mb-2">Welcome to Ulinzinga</h1>
          <p className="text-sm text-[#949494] mb-6">
            Create your account to get started
          </p>

          <form
            onSubmit={handleSignup}
            className="mt-3 w-full max-w-md flex flex-col gap-3"
          >
            <div>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                className={`py-4 px-4 text-sm border rounded-lg bg-[#F3F3F3] border-black/10 focus:outline-none w-full ${
                  validationErrors.username ? "border-red-500" : ""
                }`}
              />
              {validationErrors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.username}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={`py-4 px-4 text-sm border rounded-lg bg-[#F3F3F3] border-black/10 focus:outline-none w-full ${
                  validationErrors.email ? "border-red-500" : ""
                }`}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                className={`py-4 px-4 text-sm border rounded-lg bg-[#F3F3F3] border-black/10 focus:outline-none w-full ${
                  validationErrors.password ? "border-red-500" : ""
                }`}
              />
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`py-4 px-4 text-sm border rounded-lg bg-[#F3F3F3] border-black/10 focus:outline-none w-full ${
                  validationErrors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className="bg-black disabled:opacity-50 text-white py-4 px-4 rounded-lg flex items-center justify-center w-full relative mt-5"
            >
              <span>{isSigningUp ? "Creating Account..." : "Continue"}</span>
              {!isSigningUp && (
                <img
                  src={arrowicon}
                  alt="arrow"
                  className="h-6 w-6 absolute right-4"
                />
              )}
            </button>
          </form>

          <p className="text-sm text-center text-[#949494] mt-3">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/signin")}
              className="text-[#FFB300] cursor-pointer"
            >
              Sign In
            </span>
          </p>
        </>
      )}

      {/* Step 2: Interests Selection */}
      {step === 2 && (
        <>
          <h1 className="text-xl font-medium mb-2">Get Personalized Feed</h1>
          <p className="text-sm text-[#949494] mb-6">
            Select your interests to get personalized event recommendations
          </p>

          <div className="mt-3 w-full max-w-sm">
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-[#949494]">
                  Loading categories...
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center flex-wrap gap-3 mb-6">
                  {categoriesData?.categories?.map((category) => {
                    const isSelected = selectedInterests.includes(category._id);

                    return (
                      <button
                        key={category._id}
                        onClick={() => toggleInterest(category._id)}
                        className={`rounded-full py-3 px-4 flex items-center justify-center border transition ${
                          isSelected
                            ? "bg-black text-white border-black"
                            : "bg-[#F3F3F3] text-[#787777] border-black/10 hover:border-[#FFB300]"
                        }`}
                      >
                        <span className="text-xs font-medium">
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleInterestsComplete}
                  disabled={
                    isUpdatingInterests || selectedInterests.length === 0
                  }
                  className="bg-black disabled:opacity-50 text-white py-3 px-4 rounded-lg flex items-center justify-center w-full relative"
                >
                  <span>
                    {isUpdatingInterests
                      ? "Saving..."
                      : selectedInterests.length === 0
                      ? "Select at least one interest"
                      : `Complete Setup (${selectedInterests.length} selected)`}
                  </span>
                  {!isUpdatingInterests && selectedInterests.length > 0 && (
                    <img
                      src={arrowicon}
                      alt="arrow"
                      className="h-6 w-6 absolute right-4"
                    />
                  )}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SignUpPage;
