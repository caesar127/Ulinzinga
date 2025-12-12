import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const PaymentRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState("processing");
  const [paymentDetails, setPaymentDetails] = useState(null);

  // useEffect(() => {
  //   const status = searchParams.get("status");
  //   const txRef = searchParams.get("tx_ref");
  //   const amount = searchParams.get("amount");
  //   const message = searchParams.get("message");

  //   setPaymentDetails({ status, txRef, amount, message });
    
  //   setPaymentStatus("success");
  // }, [searchParams]);

  const handleReturnToWallet = () => navigate("/profile");
  const handleReturnHome = () => navigate("/");

  const getStatusConfig = () => {
    switch (paymentStatus) {
      case "success":
        return {
          icon: CheckCircleIcon,
          iconColor: "text-green-500",
          bgColor: "bg-green-50",
          title: "Your Transaction Has Been Processed!",
          message: "You may now close this page.",
          buttonText: "View My Wallet",
          buttonAction: handleReturnToWallet
        };
      case "failed":
        return {
          icon: XCircleIcon,
          iconColor: "text-red-500",
          bgColor: "bg-red-50",
          title: "Payment Failed",
          message: "There was an issue processing your payment.",
          buttonText: "Try Again",
          buttonAction: handleReturnToWallet
        };
      case "processing":
      default:
        return {
          icon: ArrowPathIcon,
          iconColor: "text-yellow-500",
          bgColor: "bg-yellow-50",
          title: "Processed",
          message: "Your payment has been processed.",
          buttonText: "Check Wallet",
          buttonAction: handleReturnToWallet
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center"
      >
        {/* Status Icon */}
        <div className={`mx-auto w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center mb-6`}>
          <StatusIcon className={`w-10 h-10 ${config.iconColor}`} />
        </div>

        {/* Status Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {config.title}
        </h1>

        {/* Status Message */}
        <p className="text-gray-600 mb-6">
          {config.message}
        </p>

        {/* Payment Details */}
        {paymentDetails && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm">
              {paymentDetails.txRef && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-gray-900">{paymentDetails.txRef}</span>
                </div>
              )}
              {paymentDetails.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-900">MWK {parseInt(paymentDetails.amount).toLocaleString()}</span>
                </div>
              )}
              {paymentDetails.status && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-semibold capitalize ${
                      paymentDetails.status === "success"
                        ? "text-green-600"
                        : paymentDetails.status === "failed"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {paymentDetails.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={config.buttonAction}
            className="w-full bg-black text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            {config.buttonText}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleReturnHome}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Return Home
          </motion.button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team if you continue to experience issues.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentRedirectPage;
