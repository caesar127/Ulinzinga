import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../features/auth/authApiSlice";
import { handleSuccessToast2, handleErrorToast2 } from "../../utils/toasts";
import logoIcon from "../../assets/logo/UlinzingaUlinzinga-2.png";
import arrowicon from "../../assets/icons/arrowicon.svg";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      handleErrorToast2("Invalid reset link");
    }
  }, [token]);

  const handleContinue = async () => {
    if (!newPassword || !confirmPassword) {
      return handleErrorToast2("Please fill in all fields");
    }

    if (newPassword !== confirmPassword) {
      return handleErrorToast2("Passwords do not match");
    }

    if (newPassword.length < 6) {
      return handleErrorToast2("Password must be at least 6 characters");
    }

    try {
      await resetPassword({ token, newPassword }).unwrap();
      handleSuccessToast2("Password reset successfully");
      setTimeout(() => navigate('/signin'), 2000);
    } catch (error) {
      handleErrorToast2(
        error?.data?.message || error?.message || "Failed to reset password"
      );
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <img src={logoIcon} alt="Logo" className="h-16 mb-3" />

        <h1 className="text-xl font-medium mb-2">Invalid Link</h1>
        <p className="text-sm text-[#949494]">This password reset link is invalid or has expired</p>

        <div className="mt-9 w-full max-w-sm flex flex-col gap-3">
          <p className="text-sm text-center text-[#949494] mt-2">
            <Link to={"/signin"} className="text-[#FFB300] cursor-pointer">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <img src={logoIcon} alt="Logo" className="h-16 mb-3" />

      <h1 className="text-xl font-medium mb-2">Reset Password</h1>
      <p className="text-sm text-[#949494]">Enter your new password</p>

      <div className="mt-9 w-full max-w-sm flex flex-col gap-3">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="py-4 px-4 text-sm border rounded-lg bg-[#F3F3F3] border-black/10 focus:outline-none"
          placeholder="New password"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="py-4 px-4 text-sm border rounded-lg bg-[#F3F3F3] border-black/10 focus:outline-none"
          placeholder="Confirm new password"
        />

        <button
          onClick={handleContinue}
          disabled={isLoading}
          className="bg-black disabled:opacity-50 text-sm text-white px-4 py-4 rounded-lg
          flex items-center justify-center w-full max-w-sm mt-3 relative"
        >
          <span>{isLoading ? "Resetting..." : "Reset Password"}</span>

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

export default ResetPassword;