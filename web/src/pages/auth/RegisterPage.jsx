import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompleteChanguAuthMutation } from "../../features/auth/authApiSlice";
import { handleSuccessToast2, handleErrorToast2 } from "../../utils/toasts";

function RegisterPage() {
  const navigate = useNavigate();
  const [completeChanguAuth, { isLoading, error }] =
    useCompleteChanguAuthMutation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    console.log(accessToken);
    const handleAuthCompletion = async () => {
      if (!accessToken) {
        console.error("Access token not found in redirect URL");
        return;
      }

      try {
        const result = await completeChanguAuth(accessToken).unwrap();

        if (result.token) {
          handleSuccessToast2("Login successful! Welcome back.");
          // Success - redirect to dashboard or home
          setTimeout(() => {
            navigate("/"); // or "/dashboard" depending on your routing
          }, 1500);
        }
      } catch (err) {
        console.error("Authentication completion failed:", err);
        handleErrorToast2(
          err?.data?.message || "Authentication failed. Please try again."
        );
      }
    };

    handleAuthCompletion();
  }, [completeChanguAuth, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-md w-80 text-center">
          <h1 className="text-xl font-semibold mb-4">
            Completing Authentication
          </h1>
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600">
            Please wait while we complete your authentication...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-md w-80 text-center">
          <h1 className="text-xl font-semibold mb-4">Authentication Failed</h1>
          <p className="text-red-600 mb-4">
            {error?.data?.message ||
              error?.message ||
              "Failed to complete authentication"}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Try Login Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-80 text-center">
        <h1 className="text-xl font-semibold mb-4">
          Authentication Successful!
        </h1>
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <p className="text-gray-600">Redirecting you to the dashboard...</p>
      </div>
    </div>
  );
}

export default RegisterPage;
