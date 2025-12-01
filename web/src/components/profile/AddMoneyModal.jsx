import { motion } from "framer-motion";
import Modal from "../../shared/components/ui/Modal";

export default function AddMoneyModal({
  isOpen,
  onClose,
  amount,
  setAmount,
  handleConfirmAddMoney,
  isAddingMoney,
}) {
  const handleClose = () => {
    onClose();
    setAmount("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Money to Wallet"
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
            onClick={handleConfirmAddMoney}
            disabled={!amount || parseFloat(amount) <= 0 || isAddingMoney}
            className="flex-1 bg-[#FFB300] text-black py-3 rounded-xl font-semibold hover:bg-[#e0a200] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingMoney ? "Processing..." : "Add Money"}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}