import {
  getWalletByUser,
  creditWallet,
  debitWallet,
  getTransactions,
} from "./wallet.service.js";

export const getWallet = async (req, res) => {
  try {
    const wallet = await getWalletByUser(req.user.id);
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addFunds = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const result = await creditWallet(req.user.id, amount, description);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const spendFunds = async (req, res) => {
  try {
    const { amount, description, eventId } = req.body;
    const result = await debitWallet(req.user.id, amount, description, eventId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const walletTransactions = async (req, res) => {
  try {
    const transactions = await getTransactions(req.user.id);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
