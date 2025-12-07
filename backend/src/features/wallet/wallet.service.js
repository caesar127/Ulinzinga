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
      .select("slug title start_date venue organizer")
      .populate("organizer", "name username role")
      .sort({ createdAt: -1 })
      .limit(50);

    return events.map((event) => ({
      slug: event.slug,
      title: event.title || event.slug,
      start_date: event.start_date,
      venue: event.venue,
      organizer: event.organizer,
      displayText: `${event.title || event.slug} (${event.venue || "TBA"})`,
    }));
  } catch (error) {
    throw new Error(
      "Unable to fetch available events. Please try again later."
    );
  }
};

export const getAvailableOrganizersForSavings = async () => {
  try {
    const User = (await import("../users/users.model.js")).default;
    const organizers = await User.find({ 
      role: "organizer",
      isActive: true 
    })
      .select("name username email profile")
      .sort({ name: 1 })
      .limit(100);

    return organizers.map((organizer) => ({
      id: organizer._id,
      name: organizer.name || organizer.username,
      email: organizer.email,
      displayText: `${organizer.name || organizer.username} (${organizer.email})`,
    }));
  } catch (error) {
    throw new Error(
      "Unable to fetch available organizers. Please try again later."
    );
  }
};

export const getEventsByOrganizer = async (organizerId) => {
  try {
    const Event = (await import("../events/events.model.js")).default;
    const events = await Event.find({ 
      organizer: organizerId,
      isActive: true,
      visible: true
    })
      .select("slug title start_date venue")
      .sort({ start_date: 1 })
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
      "Unable to fetch events for this organizer. Please try again later."
    );
  }
};

export const allocateFundsToEvent = async (userId, goalId, allocationData) => {
  const wallet = await getWalletByUser(userId);
  const goal = wallet.savingsGoals.id(goalId);

  if (!goal) {
    throw new Error("Savings goal not found");
  }

  if (goal.savingType !== "organizer") {
    throw new Error("Can only allocate funds from organizer support goals");
  }

  const { event_slug, event_title, amount } = allocationData;

  if (!event_slug || !amount || amount <= 0) {
    throw new Error("Invalid allocation data");
  }

  if (goal.currentAmount < amount) {
    throw new Error("Insufficient funds in savings goal");
  }

  // Check if this event is already allocated
  const existingAllocation = goal.allocations.find(
    alloc => alloc.event_slug === event_slug && alloc.status === "pending"
  );

  if (existingAllocation) {
    throw new Error("Funds already allocated to this event");
  }

  // Add allocation
  goal.allocations.push({
    event_slug,
    event_title: event_title || event_slug,
    allocatedAmount: amount,
    status: "pending"
  });

  await wallet.save();

  return goal.allocations[goal.allocations.length - 1];
};

export const getAvailableAllocationAmount = async (userId, goalId) => {
  const wallet = await getWalletByUser(userId);
  const goal = wallet.savingsGoals.id(goalId);

  if (!goal) {
    throw new Error("Savings goal not found");
  }

  if (goal.savingType !== "organizer") {
    return 0;
  }

  const allocatedAmount = goal.allocations
    .filter(alloc => alloc.status === "pending")
    .reduce((sum, alloc) => sum + alloc.allocatedAmount, 0);

  return goal.currentAmount - allocatedAmount;
};

export const createSavingsGoal = async (userId, goalData) => {
  const wallet = await getWalletByUser(userId);

  // if (wallet.regularBalance <= 0) {
  //   throw new Error("Insufficient balance.");
  // }

  let eventValidation = null;
  if (goalData.event_slug) {
    eventValidation = await validateEventSlug(goalData.event_slug);
    if (!eventValidation.isValid) {
      throw new Error(eventValidation.message);
    }
  }

  // Calculate target amount based on saving type
  let calculatedTargetAmount = goalData.targetAmount;
  if (goalData.savingType === "ticket_inclusive" && goalData.ticketType && goalData.ticketQuantity) {
    calculatedTargetAmount = goalData.ticketType.price * goalData.ticketQuantity;
  } else if (goalData.savingType === "complete_event" && goalData.ticketType && goalData.ticketQuantity) {
    const ticketAmount = goalData.ticketType.price * goalData.ticketQuantity;
    const additionalSpending = goalData.additionalSpending || 0;
    calculatedTargetAmount = ticketAmount + additionalSpending;
  }

  // Set cutoff date for ticket goals (3 days before event start)
  let cutoffDate = goalData.cutoffDate;
  if ((goalData.savingType === "ticket_inclusive" || goalData.savingType === "complete_event") && eventValidation?.event) {
    const eventStartDate = new Date(eventValidation.event.start_date);
    cutoffDate = new Date(eventStartDate.getTime() - (3 * 24 * 60 * 60 * 1000)); // 3 days before
  }

  // Validate organizer if provided
  let organizerData = {};
  if (goalData.organizerId) {
    const User = (await import("../users/users.model.js")).default;
    const organizer = await User.findById(goalData.organizerId);
    if (!organizer) {
      throw new Error("Organizer not found");
    }
    if (organizer.role !== "organizer") {
      throw new Error("Selected user is not an organizer");
    }
    organizerData = {
      organizerId: goalData.organizerId,
      organizerName: organizer.name || organizer.username,
    };
  }

  const newGoal = {
    name: goalData.name,
    description: goalData.description,
    targetAmount: calculatedTargetAmount,
    currentAmount: 0,
    isCompleted: false,
    targetDate: goalData.targetDate,
    savingType: goalData.savingType,
    event_slug: goalData.event_slug,
    ticketTypeId: goalData.ticketTypeId,
    ticketType: goalData.ticketType,
    ticketQuantity: goalData.ticketQuantity || 1,
    additionalSpending: goalData.additionalSpending || 0,
    cutoffDate,
    priority: goalData.priority || "medium",
    reminderDays: goalData.reminderDays || 3,
    isAutoPurchase: goalData.isAutoPurchase || false,
    ...organizerData,
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

  // Handle organizer validation
  if (updates.organizerId && updates.organizerId !== goal.organizerId?.toString()) {
    const User = (await import("../users/users.model.js")).default;
    const organizer = await User.findById(updates.organizerId);
    if (!organizer) {
      throw new Error("Organizer not found");
    }
    if (organizer.role !== "organizer") {
      throw new Error("Selected user is not an organizer");
    }
    goal.organizerId = updates.organizerId;
    goal.organizerName = organizer.name || organizer.username;
  }

  // Recalculate target amount if ticket quantity or type changes
  if ((updates.ticketQuantity && updates.ticketQuantity !== goal.ticketQuantity) ||
      (updates.ticketType && JSON.stringify(updates.ticketType) !== JSON.stringify(goal.ticketType)) ||
      (updates.additionalSpending !== undefined && updates.additionalSpending !== goal.additionalSpending)) {
    
    const newQuantity = updates.ticketQuantity || goal.ticketQuantity || 1;
    const ticketType = updates.ticketType || goal.ticketType;
    const additionalSpending = updates.additionalSpending !== undefined ? updates.additionalSpending : goal.additionalSpending || 0;
    
    if ((goal.savingType === "ticket_inclusive" || goal.savingType === "complete_event") && ticketType && ticketType.price) {
      const ticketAmount = ticketType.price * newQuantity;
      if (goal.savingType === "complete_event") {
        goal.targetAmount = ticketAmount + additionalSpending;
      } else {
        goal.targetAmount = ticketAmount;
      }
    }
  }

  // Update basic fields
  if (updates.name) goal.name = updates.name;
  if (updates.description) goal.description = updates.description;
  if (updates.targetAmount && (!updates.ticketQuantity && !updates.ticketType)) {
    goal.targetAmount = updates.targetAmount;
  }
  if (updates.targetDate) goal.targetDate = updates.targetDate;
  if (updates.savingType) goal.savingType = updates.savingType;
  if (updates.event_slug) goal.event_slug = updates.event_slug;
  if (updates.ticketTypeId) goal.ticketTypeId = updates.ticketTypeId;
  if (updates.ticketType) goal.ticketType = updates.ticketType;
  if (updates.ticketQuantity) goal.ticketQuantity = updates.ticketQuantity;
  if (updates.additionalSpending !== undefined) goal.additionalSpending = updates.additionalSpending;
  if (updates.cutoffDate) goal.cutoffDate = updates.cutoffDate;
  if (updates.priority) goal.priority = updates.priority;
  if (updates.reminderDays !== undefined) goal.reminderDays = updates.reminderDays;
  if (updates.isAutoPurchase !== undefined) goal.isAutoPurchase = updates.isAutoPurchase;

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
