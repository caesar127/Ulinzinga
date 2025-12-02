import { motion } from "framer-motion";
import Modal from "../../shared/components/ui/Modal";
import { handleSuccessToast2, handleErrorToast2 } from "../../utils/toasts";
import { useDepositToSavingsMutation } from "../../features/wallet/walletApiSlice";

export default function AddToSavingsModal({
  isOpen,
  onClose,
  goalName,
  goalId,
  amount,
  setAmount,
  handleConfirmAddToSavings,
  isAddingToSavings,
}) {
  const [depositToSavings] = useDepositToSavingsMutation();

  const handleConfirmAddToSavingsWithToast = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      handleErrorToast2("Please enter a valid amount");
      return;
    }

    if (!goalId) {
      handleErrorToast2("Savings goal not found");
      return;
    }

    try {
      await depositToSavings({
        goalId,
        amount: parseFloat(amount),
      }).unwrap();

      handleSuccessToast2(`Successfully added MWK ${parseFloat(amount).toLocaleString()} to ${goalName}`);
      onClose();
      setAmount("");
    } catch (error) {
      handleErrorToast2(error?.data?.message || "Failed to add money to savings goal");
    }
  };

  const handleClose = () => {
    onClose();
    setAmount("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Add Money to ${goalName || 'Savings Goal'}`}
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (MWK)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
            min="1"
            step="0.01"
          />
          <p className="text-xs text-gray-500 mt-1">
            This amount will be transferred from your wallet balance to your savings goal.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirmAddToSavingsWithToast}
            disabled={!amount || parseFloat(amount) <= 0 || isAddingToSavings}
            className="flex-1 bg-[#FFB300] text-black py-3 rounded-xl font-semibold hover:bg-[#e0a200] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingToSavings ? "Adding..." : "Add to Savings"}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}