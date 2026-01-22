import React from "react";
import { XCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function TicketPurchaseCancelPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center text-black px-6">
      <div className="text-center space-y-2 max-w-md">
        <div className="mx-auto w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="w-14 h-14 text-red-500" />
        </div>

        <h1 className="text-3xl font-semibold tracking-wide">
          Purchase Cancelled
        </h1>

        <p className="text-sm text-gray-500 leading-relaxed">
          Your ticket purchase has been cancelled.
          <br />
          You can try again anytime.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-xs text-gray-500 mt-4">
          <p className="mb-1 font-medium text-black">Need help?</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact support if you encountered an issue</li>
            <li>Ensure your payment details are correct</li>
          </ul>
        </div>

        <div className="mt-6">
          {user ? (
            <div className="bg-[#FFB300]/10 border border-[#FFB300]/30 rounded-xl p-4">
              <p className="text-sm font-medium text-black">
                Ready to try again?
              </p>
              <p className="text-xs text-gray-600 mt-1 mb-3">
                Browse events and purchase tickets securely with Ulinzinga.
              </p>

              <Link
                to="/events"
                className="inline-block bg-[#FFB300] text-black px-6 py-2 rounded-full text-xs font-semibold hover:bg-[#e0a000] transition"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
              <p className="text-sm font-medium text-black">
                Want to unlock more features?
              </p>
              <p className="text-xs text-gray-600 mt-1 mb-3">
                Sign in or create an account to save up for events, track
                purchases, and get personalized recommendations.
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

export default TicketPurchaseCancelPage;
