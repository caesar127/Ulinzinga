import React, { useEffect } from "react";
import { useGetChanguConnectUrlQuery } from "../../features/auth/authApiSlice";
import { handleErrorToast2 } from "../../utils/toasts";

function LoginPage() {
  const { data: connectData, isLoading, error } = useGetChanguConnectUrlQuery();

  useEffect(() => {
    if (connectData?.url) {
      // Automatically redirect to PayChangu Connect URL
      window.location.href = connectData.url;
    }
  }, [connectData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-md w-80 text-center">
          <h1 className="text-xl font-semibold mb-4">Login with PayChangu</h1>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Connecting...</span>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (error) {
      handleErrorToast2(error?.data?.message || "Failed to connect to PayChangu");
    }
  }, [error]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-md w-80 text-center">
          <h1 className="text-xl font-semibold mb-4">Login with PayChangu</h1>
          <p className="text-gray-600 mb-4">
            Something went wrong. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-80 text-center">
        <h1 className="text-xl font-semibold mb-4">Login with PayChangu</h1>
        <p className="text-gray-600 mb-4">
          Click the button below to connect with PayChangu
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Connect with PayChangu
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
