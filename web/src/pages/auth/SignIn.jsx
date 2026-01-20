import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetMerchantConnectUrlMutation,
  useUserSigninMutation,
} from "../../features/auth/authApiSlice";
import { handleSuccessToast2, handleErrorToast2 } from "../../utils/toasts";
import logoIcon from "../../assets/logo/UlinzingaUlinzinga-2.png";
import arrowicon from "../../assets/icons/arrowicon.svg";

function SignInPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [getMerchantConnectUrl, { isLoading, error }] =
    useGetMerchantConnectUrlMutation();
  const [userSignIn] = useUserSigninMutation();

  const handleContinue = async () => {
    if (!email || !password) {
      return handleErrorToast2("Please enter email and password");
    }

    try {
      const response = await userSignIn({
        email,
        password,
      }).unwrap();
      
      handleSuccessToast2("Logged in successfully");
      
      const userRole = response?.user?.role;
      if (userRole === 'admin') {
        navigate("/admin/dashboard");
      } else if (userRole === 'organizer') {
        navigate("/organizer/dashboard");
      } else if (userRole === 'vendor') {
        navigate("/vendor/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      handleErrorToast2(
        error?.data?.message || error?.message || "Login failed"
      );
    }
  };

  const handleMerchantLogin = async () => {
    try {
      const result = await getMerchantConnectUrl().unwrap();
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      handleErrorToast2(
        error?.data?.message || "Failed to connect to PayChangu"
      );
    }
  };

  useEffect(() => {
    if (error) {
      handleErrorToast2(
        error?.data?.message || "Failed to connect to PayChangu"
      );
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <img src={logoIcon} alt="Logo" className="h-16 mb-3" />

      <h1 className="text-xl font-medium mb-2">Welcome Back</h1>
      <p className="text-sm text-[#949494]">Log in to your Ulinzinga account</p>

      <div className="mt-9 w-full max-w-sm flex flex-col gap-3">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="py-4 px-4 text-sm border rounded-lg bg-[#F3F3F3] border-black/10 focus:outline-none"
          placeholder="Enter your email"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="py-4 px-4 text-sm border rounded-lg bg-[#F3F3F3] border-black/10 focus:outline-none"
          placeholder="Password"
        />

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-[#FFB300] hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          onClick={handleContinue}
          disabled={isLoading}
          className="bg-black disabled:opacity-50 text-sm text-white px-4 py-4 rounded-lg 
          flex items-center justify-center w-full max-w-sm mt-3 relative"
        >
          <span>{isLoading ? "Loading..." : "Continue"}</span>

          {!isLoading && (
            <img
              src={arrowicon}
              alt="arrow"
              className="h-6 w-6 absolute right-4"
            />
          )}
        </button>

        <div className="flex items-center w-full max-w-sm gap-3 my-2">
          <span className="flex-1 h-px bg-gray-300"></span>
          <span className="text-[#8C8C8C] text-sm">or</span>
          <span className="flex-1 h-px bg-gray-300"></span>
        </div>

        <button
          onClick={handleMerchantLogin}
          disabled={isLoading}
          className="bg-black disabled:opacity-50 text-sm text-white px-4 py-4 rounded-lg 
          flex items-center justify-center w-full max-w-sm relative"
        >
          <span>
            {isLoading ? "Loading..." : "Log In as Vendor / Organizer"}
          </span>

          {!isLoading && (
            <img
              src={arrowicon}
              alt="arrow"
              className="h-6 w-6 absolute right-4"
            />
          )}
        </button>

        <p className="text-sm text-center text-[#949494] mt-2">
          Don't have an Account?{" "}
          <Link to={"/signup"} className="text-[#FFB300] cursor-pointer">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignInPage;
