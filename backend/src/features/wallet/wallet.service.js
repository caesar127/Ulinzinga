import axios from "axios";
import Wallet from "./wallet.model.js";
import Transaction from "./transaction.model.js";

// Get wallet by user ID
export const getWalletByUser = async (userId) => {
  try {
    // First try to find existing wallet
    let wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      // If no wallet found, create a new one with proper structure
      const walletData = {
        user: userId,
        regularBalance: 0,
        savingsBalance: 0,
        currency: "MWK",
        savingsGoals: [],
      };

      wallet = await Wallet.create(walletData);
    } else {
      // If wallet exists but missing new fields, update it
      let needsUpdate = false;
      const updates = {};

      if (wallet.regularBalance === undefined) {
        updates.regularBalance = 0;
        needsUpdate = true;
      }

      if (wallet.savingsBalance === undefined) {
        updates.savingsBalance = 0;
        needsUpdate = true;
      }

      if (!wallet.savingsGoals) {
        updates.savingsGoals = [];
        needsUpdate = true;
      }

      if (needsUpdate) {
        wallet = await Wallet.findByIdAndUpdate(
          wallet._id,
          { $set: updates },
          { new: true, runValidators: true }
        );
      }
    }

    return wallet;
  } catch (error) {
    throw new Error(`Failed to get wallet: ${error.message}`);
  }
};

export const createSavingsGoal = async (userId, goalData) => {
  const wallet = await getWalletByUser(userId);
  
  const newGoal = {
    name: goalData.name,
    description: goalData.description,
    targetAmount: goalData.targetAmount,
    currentAmount: 0,
    isCompleted: false,
    targetDate: goalData.targetDate,
    savingType: goalData.savingType,
    event_slug: goalData.event_slug,
    ticketTypeId: goalData.ticketTypeId,
    ticketType: goalData.ticketType,
  };

  wallet.savingsGoals.push(newGoal);
  await wallet.save();

  return wallet.savingsGoals[wallet.savingsGoals.length - 1];
};

export const depositMoney = async (userId, amount, description, event_slug) => {
  const wallet = await getWalletByUser(userId);
  
  const User = (await import("../users/users.model.js")).default;
  const user = await User.findById(userId).select("email name");

  const tx_ref = `UL-DEPOSIT-${Date.now()}-${userId}`;

  const transaction = await Transaction.create({
    user: userId,
    wallet: wallet._id,
    type: "credit",
    subtype: "deposit",
    amount,
    description: description || "Money deposited to wallet",
    event: event_slug,
    tx_ref,
    status: "pending",
  });

  // PayChangu payment details for deposit
  const backendUrl = process.env.BACKEND_URL || "https://ulinzinga.onrender.com/api";
  const frontendUrl = process.env.FRONTEND_URL || "https://ulinzinga.vercel.app/";

  // Extract name parts
  const nameParts = (user?.name || "").split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const paymentDetails = {
    currency: "MWK",
    amount: `${amount}`,
    email: user?.email || "",
    first_name: firstName,
    last_name: lastName,
    callback_url: `${frontendUrl}/payment/redirect?status=success`,
    return_url: `${frontendUrl}/profile`,
    tx_ref,
    customization: {
      title: "Wallet Deposit",
      description: description || "Deposit to Ulinzinga Wallet",
    },
  };

  const paymentHeaders = {
    accept: "application/json",
    "content-type": "application/json",
    Authorization: `Bearer ${process.env.PAYCHANGU_API_KEY}`,
  };
   
  try {
    const paymentResponse = await axios.post(
      "https://api.paychangu.com/payment",
      paymentDetails,
      { headers: paymentHeaders }
    );

    const checkoutUrl = paymentResponse?.data?.data?.checkout_url;

    return {
      wallet,
      transaction,
      payment: {
        checkout_url: checkoutUrl,
        tx_ref,
      },
    };
  } catch (error) {
    transaction.status = "failed";
    await transaction.save();
    throw new Error("Payment initialization failed: " + error.message);
  }
};

export const transferMoney = async (fromUserId, transferData) => {
  const { toUserId, toAccountType, amount, description, event_slug } =
    transferData;

  // Get sender's wallet
  const fromWallet = await getWalletByUser(fromUserId);

  if (fromWallet.regularBalance < amount) {
    throw new Error("Insufficient balance for transfer");
  }

  // Generate transaction reference
  const tx_ref = `UL-TRANSFER-${Date.now()}-${fromUserId}`;

  // Create outgoing transaction for sender
  const outgoingTransaction = await Transaction.create({
    user: fromUserId,
    wallet: fromWallet._id,
    type: "debit",
    subtype: "transfer_out",
    amount,
    description: description || `Transfer to ${toAccountType}`,
    event: event_slug,
    toUser: toUserId,
    toAccountType,
    toAccountId: toUserId,
    tx_ref,
    status: "pending",
  });

  // Deduct from sender's wallet
  fromWallet.regularBalance -= amount;
  await fromWallet.save();

  // Create incoming transaction for recipient
  const toWallet = await getWalletByUser(toUserId);
  const incomingTransaction = await Transaction.create({
    user: toUserId,
    wallet: toWallet._id,
    type: "credit",
    subtype: "transfer_in",
    amount,
    description: description || `Transfer from user`,
    event: event_slug,
    fromUser: fromUserId,
    tx_ref,
    status: "pending",
  });

  // Add to recipient's wallet
  toWallet.regularBalance += amount;
  await toWallet.save();

  // Mark both transactions as completed
  outgoingTransaction.status = "completed";
  incomingTransaction.status = "completed";
  await outgoingTransaction.save();
  await incomingTransaction.save();

  return {
    success: true,
    fromTransaction: outgoingTransaction,
    toTransaction: incomingTransaction,
    fromWallet,
    toWallet,
  };
};

// Deposit money to savings
export const depositToSavings = async (userId, amount, goalId) => {
  const wallet = await getWalletByUser(userId);
  const goal = wallet.savingsGoals.id(goalId);

  if (!goal) {
    throw new Error("Savings goal not found");
  }

  if (wallet.regularBalance < amount) {
    throw new Error("Insufficient regular balance");
  }

  if (goal.isCompleted) {
    throw new Error("Savings goal is already completed");
  }

  // Transfer from regular to savings
  wallet.regularBalance -= amount;
  goal.currentAmount += amount;
  
  if (goal.currentAmount >= goal.targetAmount) {
    goal.isCompleted = true;
  }

  await wallet.save();
  
  const transaction = await Transaction.create({
    user: userId,
    wallet: wallet._id,
    type: "debit",
    subtype: "savings_deposit",
    amount,
    description: `Deposit to savings goal: ${goal.name}`,
    savingsGoalId: goalId,
    status: "completed",
  });

  return { wallet, transaction, goal };
};

// Withdraw money from savings (only when goal is reached)
export const withdrawFromSavings = async (userId, amount, goalId) => {
  const wallet = await getWalletByUser(userId);
  const goal = wallet.savingsGoals.id(goalId);

  if (!goal) {
    throw new Error("Savings goal not found");
  }

  if (!goal.isCompleted) {
    throw new Error("Cannot withdraw from incomplete savings goal");
  }

  if (goal.currentAmount < amount) {
    throw new Error("Insufficient savings balance");
  }

  // Transfer from savings to regular
  wallet.savingsBalance -= amount;
  wallet.regularBalance += amount;
  goal.currentAmount -= amount;

  await wallet.save();

  // Create transaction record
  const transaction = await Transaction.create({
    user: userId,
    wallet: wallet._id,
    type: "credit",
    subtype: "savings_withdraw",
    amount,
    description: `Withdrawal from savings goal: ${goal.name}`,
    savingsGoalId: goalId,
    status: "completed",
  });

  return { wallet, transaction, goal };
};

// Credit wallet (existing function - updated for new structure)
export const creditWallet = async (userId, amount, description, event_slug) => {
  const wallet = await getWalletByUser(userId);
  wallet.regularBalance += amount;
  await wallet.save();

  const tx_ref = `UL-${Date.now()}-${userId}`;

  const transaction = await Transaction.create({
    user: userId,
    wallet: wallet._id,
    type: "credit",
    subtype: "event_payment",
    amount,
    description,
    event: event_slug,
    tx_ref,
    status: "completed",
  });

  return { wallet, transaction };
};

// Debit wallet (existing function - updated for new structure)
export const debitWallet = async (userId, amount, description, event_slug) => {
  const wallet = await getWalletByUser(userId);
  if (wallet.regularBalance < amount) {
    throw new Error("Insufficient balance");
  }

  wallet.regularBalance -= amount;
  await wallet.save();

  const transaction = await Transaction.create({
    user: userId,
    wallet: wallet._id,
    type: "debit",
    subtype: "event_payment",
    amount,
    description,
    event: event_slug,
    status: "completed",
    tx_ref: null,
  });

  return { wallet, transaction };
};

// Get transactions (enhanced)
export const getTransactions = async (userId, filters = {}) => {
  const query = { user: userId };

  if (filters.type) query.type = filters.type;
  if (filters.subtype) query.subtype = filters.subtype;
  if (filters.status) query.status = filters.status;
  if (filters.event) query.event = filters.event;
  if (filters.savingsGoalId) query.savingsGoalId = filters.savingsGoalId;

  return Transaction.find(query).sort({ createdAt: -1 });
};

// Handle PayChangu webhook/callback
export const handlePayChanguCallback = async (callbackData) => {
  const { tx_ref, status, amount } = callbackData;
  
  const transaction = await Transaction.findOne({ tx_ref });
  
  if (!transaction) {
    throw new Error("Transaction not found");
  }
  
  if (transaction.status === "completed") {
    console.log(`Transaction ${tx_ref} already completed, skipping wallet update`);
    return transaction;
  }
  
  transaction.status = status === "successful" ? "completed" : "failed";
  await transaction.save();
  
  if (status === "successful") {
    const wallet = await Wallet.findById(transaction.wallet);
    if (transaction.type === "credit") {
      wallet.regularBalance += transaction.amount;
    } else {
      wallet.regularBalance -= transaction.amount;
    }
    await wallet.save();
  }

  return transaction;
};

// Get savings goals for user
export const getSavingsGoals = async (userId) => {
  const wallet = await getWalletByUser(userId);
  return wallet.savingsGoals;
};

// Update savings goal
export const updateSavingsGoal = async (userId, goalId, updates) => {
  const wallet = await getWalletByUser(userId);
  const goal = wallet.savingsGoals.id(goalId);

  if (!goal) {
    throw new Error("Savings goal not found");
  }

  // Update allowed fields
  if (updates.name) goal.name = updates.name;
  if (updates.description) goal.description = updates.description;
  if (updates.targetAmount) goal.targetAmount = updates.targetAmount;
  if (updates.targetDate) goal.targetDate = updates.targetDate;
  if (updates.savingType) goal.savingType = updates.savingType;
  if (updates.event_slug) goal.event_slug = updates.event_slug;
  if (updates.ticketTypeId) goal.ticketTypeId = updates.ticketTypeId;
  if (updates.ticketType) goal.ticketType = updates.ticketType;

  // Check if goal is completed after update
  if (goal.currentAmount >= goal.targetAmount) {
    goal.isCompleted = true;
  }

  await wallet.save();
  return goal;
};

// Delete savings goal
export const deleteSavingsGoal = async (userId, goalId) => {
  const wallet = await getWalletByUser(userId);
  const goal = wallet.savingsGoals.id(goalId);

  if (!goal) {
    throw new Error("Savings goal not found");
  }

  if (goal.currentAmount > 0) {
    throw new Error("Cannot delete goal with existing savings");
  }

  wallet.savingsGoals.pull(goalId);
  await wallet.save();

  return { success: true };
};
