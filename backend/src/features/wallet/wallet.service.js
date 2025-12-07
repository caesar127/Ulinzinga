import axios from "axios";
import Wallet from "./wallet.model.js";
import Transaction from "./transaction.model.js";
import Event from "../events/events.model.js";
import User from "../users/users.model.js";

export const getWalletByUser = async (userId) => {
  try {
    let wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      const walletData = {
        user: userId,
        regularBalance: 0,
        savingsBalance: 0,
        currency: "MWK",
        savingsGoals: [],
      };

      wallet = await Wallet.create(walletData);
    } else {
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

export const checkSavingsEligibility = async (userId) => {
  const wallet = await getWalletByUser(userId);

  return {
    hasBalance: wallet.regularBalance > 0,
    balance: wallet.regularBalance,
    canCreateGoals: wallet.regularBalance > 0,
    canDeposit: wallet.regularBalance > 0,
    message:
      wallet.regularBalance > 0
        ? "You can create savings goals and make deposits"
        : "You need to add money to your wallet before creating savings goals",
  };
};

export const validateEventSlug = async (eventSlug) => {
  if (!eventSlug) {
    return { isValid: true, message: "No event slug provided" };
  }

  try {
    const eventExists = await Event.findOne({ slug: eventSlug });

    if (!eventExists) {
      return {
        isValid: false,
        message: `Event with slug "${eventSlug}" not found.`,
      };
    }

    return {
      isValid: true,
      message: `Event validation passed for slug: ${eventSlug}`,
      event: eventExists,
    };
  } catch (error) {
    return {
      isValid: false,
      message: `Unable to validate event slug "${eventSlug}".`,
      error: error.message,
    };
  }
};

export const getAvailableEventsForSavings = async () => {
  try {
    const events = await Event.find({
      isActive: true,
      visible: true,
    })
      .select("slug title start_date venue")
      .sort({ createdAt: -1 })
      .limit(50);

    return events.map((event) => ({
      slug: event.slug,
      title: event.title || event.slug,
      start_date: event.start_date,
      venue: event.venue,
      displayText: `${event.title || event.slug} (${event.venue || "TBA"})`,
    }));
  } catch (error) {
    throw new Error(
      "Unable to fetch available events. Please try again later."
    );
  }
};

export const createSavingsGoal = async (userId, goalData) => {
  const wallet = await getWalletByUser(userId);

  // if (wallet.regularBalance <= 0) {
  //   throw new Error("Insufficient balance.");
  // }

  if (goalData.event_slug) {
    const eventValidation = await validateEventSlug(goalData.event_slug);
    if (!eventValidation.isValid) {
      throw new Error(eventValidation.message);
    }
  }

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

  const backendUrl =
    process.env.BACKEND_URL || "https://ulinzinga.onrender.com/api";
  const frontendUrl =
    process.env.FRONTEND_URL || "https://ulinzinga.vercel.app/";

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

  const fromWallet = await getWalletByUser(fromUserId);

  if (fromWallet.regularBalance < amount) {
    throw new Error("Insufficient balance for transfer");
  }

  const tx_ref = `UL-TRANSFER-${Date.now()}-${fromUserId}`;

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

  fromWallet.regularBalance -= amount;
  await fromWallet.save();

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

  toWallet.regularBalance += amount;
  await toWallet.save();

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

export const depositToSavings = async (userId, amount, goalId) => {
  const wallet = await getWalletByUser(userId);
  const goal = wallet.savingsGoals.id(goalId);

  if (!goal) {
    throw new Error("Savings goal not found");
  }

  if (wallet.regularBalance <= 0) {
    throw new Error("Insufficient balance.");
  }

  if (wallet.regularBalance < amount) {
    throw new Error(
      `Insufficient balance. You only have ${wallet.regularBalance} MWK.`
    );
  }

  if (goal.isCompleted) {
    throw new Error("Savings goal is already completed");
  }

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
    throw new Error(
      `Insufficient savings. You have ${goal.currentAmount} MWK.`
    );
  }

  goal.currentAmount -= amount;
  wallet.regularBalance += amount;

  await wallet.save();

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

export const getTransactions = async (userId, filters = {}) => {
  const query = { user: userId };

  if (filters.type) query.type = filters.type;
  if (filters.subtype) query.subtype = filters.subtype;
  if (filters.status) query.status = filters.status;
  if (filters.event) query.event = filters.event;
  if (filters.savingsGoalId) query.savingsGoalId = filters.savingsGoalId;

  return Transaction.find(query).sort({ createdAt: -1 });
};

export const handlePayChanguCallback = async (callbackData) => {
  const { tx_ref, status } = callbackData;

  const transaction = await Transaction.findOne({ tx_ref });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  if (transaction.status === "completed") {
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

export const getSavingsGoals = async (userId) => {
  const wallet = await getWalletByUser(userId);
  return wallet.savingsGoals;
};

export const updateSavingsGoal = async (userId, goalId, updates) => {
  const wallet = await getWalletByUser(userId);
  const goal = wallet.savingsGoals.id(goalId);

  if (!goal) {
    throw new Error("Savings goal not found");
  }

  if (updates.event_slug && updates.event_slug !== goal.event_slug) {
    const eventValidation = await validateEventSlug(updates.event_slug);
    if (!eventValidation.isValid) {
      throw new Error(`Invalid event slug: ${eventValidation.message}`);
    }
  }

  if (updates.name) goal.name = updates.name;
  if (updates.description) goal.description = updates.description;
  if (updates.targetAmount) goal.targetAmount = updates.targetAmount;
  if (updates.targetDate) goal.targetDate = updates.targetDate;
  if (updates.savingType) goal.savingType = updates.savingType;
  if (updates.event_slug) goal.event_slug = updates.event_slug;
  if (updates.ticketTypeId) goal.ticketTypeId = updates.ticketTypeId;
  if (updates.ticketType) goal.ticketType = updates.ticketType;

  if (goal.currentAmount >= goal.targetAmount) {
    goal.isCompleted = true;
  }

  await wallet.save();
  return goal;
};

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
