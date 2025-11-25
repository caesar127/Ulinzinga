import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function TicketPurchaseRedirectPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center text-black px-6">
      <div className="text-center space-y-2 max-w-md">
        
        {/* Success Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-[#FFB300]/10 flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14 text-[#FFB300]" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold tracking-wide">
          Ticket Purchased Successfully
        </h1>

        {/* Message */}
        <p className="text-sm text-gray-500 leading-relaxed">
          Your ticket has been sent to your email.<br />
          Please check your inbox for the QR code and event details.
        </p>

        {/* Info Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-xs text-gray-500 mt-4">
          <p className="mb-1 font-medium text-black">Didn’t receive your ticket?</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Check your spam or promotions folder</li>
            <li>Ensure your email address is correct</li>
          </ul>
        </div>

        {/* Auth-related Section */}
        <div className="mt-6">
          {user ? (
            // ------------------ Authenticated User ------------------
            <div className="bg-[#FFB300]/10 border border-[#FFB300]/30 rounded-xl p-4">
              <p className="text-sm font-medium text-black">
                Want to save up for your next event?
              </p>
              <p className="text-xs text-gray-600 mt-1 mb-3">
                Ulinzinga lets you create an event savings goal and track your progress.
              </p>

              <Link
                to="/savings/create"
                className="inline-block bg-[#FFB300] text-black px-6 py-2 rounded-full text-xs font-semibold hover:bg-[#e0a000] transition"
              >
                Create Savings Goal
              </Link>
            </div>
          ) : (
            // ------------------ NOT Authenticated User ------------------
            <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
              <p className="text-sm font-medium text-black">
                Want to unlock more features?
              </p>
              <p className="text-xs text-gray-600 mt-1 mb-3">
                Sign in or create an account to save up for events, track purchases,
                and get personalized recommendations.
              </p>

              <div className="flex items-center justify-center gap-3">
                <Link
                  to="/signin"
                  className="bg-black text-white px-5 py-2 rounded-full text-xs hover:bg-black/80 transition"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="border border-black px-5 py-2 rounded-full text-xs hover:bg-black hover:text-white transition"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-black/80 transition"
        >
          Back to Events
        </button>
      </div>
    </div>
  );
}

export default TicketPurchaseRedirectPage;
