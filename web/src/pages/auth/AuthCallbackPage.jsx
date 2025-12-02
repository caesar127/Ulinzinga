import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyMerchantTokenMutation } from "../../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import {
  setCredentials,
  setVendorCredentials,
  setError,
  setLoading,
} from "../../features/auth/authSlice";
import { handleErrorToast2, handleSuccessToast2 } from "../../utils/toasts";
import logoIcon from "../../assets/logo/UlinzingaUlinzinga-2.png";

function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [verifyMerchantToken] = useVerifyMerchantTokenMutation();
  const [status, setStatus] = useState("Processing authentication...");
  const [error, setErrorState] = useState(null);

  const getAuthType = () => {
    const code = searchParams.get("code");
    const accessToken = searchParams.get("access_token");
    const errorParam = searchParams.get("error");

    if (errorParam) return "error";
    if (code && !accessToken) return "google";
    if (accessToken) return "merchant";
    return "unknown";
  };

  const authType = getAuthType();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        dispatch(setLoading(true));

        const code = searchParams.get("code");
        const accessToken = searchParams.get("access_token");
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (errorParam) throw new Error(errorDescription || errorParam);

        if (authType === "merchant") {
          setStatus("Verifying merchant authentication...");
          const selectedRole =
            localStorage.getItem("currentMerchantRole") || "organizer";

          const result = await verifyMerchantToken({
            access_token: accessToken,
            selected_role: selectedRole,
          }).unwrap();

          localStorage.removeItem("currentMerchantRole");

          dispatch(
            setVendorCredentials({
              user: result.user,
              token: result.token,
              business: result.business,
            })
          );

          handleSuccessToast2("Merchant authentication successful!");

          // Redirect by role
          const userRole = result.user?.role;
          if (userRole === "vendor") navigate("/vendor/dashboard");
          else if (userRole === "organizer") navigate("/organizer/dashboard");
          else navigate("/events");
        } else if (authType === "google") {
          setStatus("Completing Google authentication...");
          const response = await fetch(
            `/api/auth/google/callback?code=${code}`,
            {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Google authentication failed");
          }

          const result = await response.json();
          dispatch(setCredentials({ user: result.user, token: result.token }));
          handleSuccessToast2("Google authentication successful!");
          navigate("/");
        } else if (authType === "error") {
          throw new Error(errorDescription || "Authentication failed");
        } else {
          throw new Error("Unknown authentication type");
        }
      } catch (err) {
        console.error(err);
        const message = err?.message || "Authentication failed";
        setErrorState(message);
        setStatus("Authentication failed");
        dispatch(setError(message));
        handleErrorToast2(message);

        setTimeout(() => navigate("/"), 3000);
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (authType !== "unknown") handleCallback();
    else {
      setErrorState("Invalid authentication callback");
      setStatus("Invalid callback parameters");
    }
  }, [searchParams, verifyMerchantToken, dispatch, navigate, authType]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <img src={logoIcon} alt="Ulinzinga" className="h-16 mb-6" />

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        {/* Status Icon */}
        <div className="w-16 h-16 mx-auto mb-4">
          {error ? (
            <div className="w-full h-full rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ) : (
            <div className="w-full h-full rounded-full bg-yellow-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            </div>
          )}
        </div>

        {/* Title & Status */}
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          {error ? "Authentication Failed" : "Processing Authentication"}
        </h2>
        <p className="text-gray-600 mb-4">{status}</p>

        {/* Error Box */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        {error && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/signin")}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}

        {!error && (
          <div className="text-sm text-gray-500 mt-2">
            <p>Please wait while we complete your authentication...</p>
          </div>
        )}

        {/* Auth Type Info */}
        {authType === "merchant" && (
          <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800 text-xs font-medium">
              Merchant Login: Connecting your PayChangu account
            </p>
          </div>
        )}
        {authType === "google" && (
          <div className="mt-6 p-3 bg-green-50 rounded-lg">
            <p className="text-green-800 text-xs font-medium">
              Google Login: Completing OAuth authentication
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthCallbackPage;
