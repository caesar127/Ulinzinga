import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../features/auth/authApiSlice";
import { handleSuccessToast2, handleErrorToast2 } from "../../utils/toasts";
import logoIcon from "../../assets/logo/UlinzingaUlinzinga-2.png";
import arrowicon from "../../assets/icons/arrowicon.svg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleContinue = async () => {
    if (!email) {
      return handleErrorToast2("Please enter your email address");
    }

    try {
      await forgotPassword(email).unwrap();
      handleSuccessToast2("Password reset email sent. Check your inbox.");
    } catch (error) {
      handleErrorToast2(
        error?.data?.message || error?.message || "Failed to send reset email"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <img src={logoIcon} alt="Logo" className="h-16 mb-3" />

      <h1 className="text-xl font-medium mb-2">Forgot Password</h1>
      <p className="text-sm text-[#949494]">Enter your email to reset your password</p>

      <div className="mt-9 w-full max-w-sm flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="py-4 px-4 text-sm border rounded-lg bg-[#F3F3F3] border-black/10 focus:outline-none"
          placeholder="Enter your email"
        />

        <button
          onClick={handleContinue}
          disabled={isLoading}
          className="bg-black disabled:opacity-50 text-sm text-white px-4 py-4 rounded-lg
          flex items-center justify-center w-full max-w-sm mt-3 relative"
        >
          <span>{isLoading ? "Sending..." : "Send Reset Link"}</span>

          {!isLoading && (
            <img
              src={arrowicon}
              alt="arrow"
              className="h-6 w-6 absolute right-4"
            />
          )}
        </button>

        <p className="text-sm text-center text-[#949494] mt-2">
          Remember your password?{" "}
          <Link to={"/signin"} className="text-[#FFB300] cursor-pointer">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;