import Wallet from "./wallet.model.js";
import Transaction from "./transaction.model.js";

export const getWalletByUser = async (userId) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({ user: userId });
  }
  return wallet;
};

export const creditWallet = async (userId, amount, description, eventId) => {
  const wallet = await getWalletByUser(userId);
  wallet.balance += amount;
  await wallet.save();

  const transaction = await Transaction.create({
    user: userId,
    wallet: wallet._id,
    type: "credit",
    amount,
    description,
    event: eventId,
  });

  return { wallet, transaction };
};

export const debitWallet = async (userId, amount, description, eventId) => {
  const wallet = await getWalletByUser(userId);
  if (wallet.balance < amount) throw new Error("Insufficient balance");
  wallet.balance -= amount;
  await wallet.save();

  const transaction = await Transaction.create({
    user: userId,
    wallet: wallet._id,
    type: "debit",
    amount,
    description,
    event: eventId,
  });

  return { wallet, transaction };
};

export const getTransactions = async (userId) => {
  return Transaction.find({ user: userId }).sort({ createdAt: -1 });
};
