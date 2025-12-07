import {
  getWalletByUser,
  creditWallet,
  debitWallet,
  getTransactions,
  depositMoney,
  transferMoney,
  depositToSavings,
  withdrawFromSavings,
  createSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal,
  handlePayChanguCallback,
  checkSavingsEligibility,
  getAvailableEventsForSavings,
  getAvailableOrganizersForSavings,
  getEventsByOrganizer,
  allocateFundsToEvent,
  getAvailableAllocationAmount,
} from "./wallet.service.js";

// Get wallet information
export const getWallet = async (req, res) => {
  try {
    const wallet = await getWalletByUser(req.user.userId);
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add funds to wallet (enhanced version)
export const addFunds = async (req, res) => {
  try {
    const { amount, description, event_slug } = req.body;
    const result = await depositMoney(
      req.user.userId,
      amount,
      description,
      event_slug
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Spend funds from wallet
export const spendFunds = async (req, res) => {
  try {
    const { amount, description, event_slug } = req.body;
    const result = await debitWallet(
      req.user.userId,
      amount,
      description,
      event_slug
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Transfer money to organizer/vendor
export const transferFunds = async (req, res) => {
  try {
    const { toUserId, toAccountType, amount, description, event_slug } = req.body;
    const result = await transferMoney(req.user.userId, {
      toUserId,
      toAccountType,
      amount,
      description,
      event_slug,
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get wallet transactions
export const walletTransactions = async (req, res) => {
  try {
    const { type, subtype, status, event, savingsGoalId } = req.query;
    const filters = { type, subtype, status, event, savingsGoalId };
    const transactions = await getTransactions(req.user.userId, filters);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a savings goal
export const createGoal = async (req, res) => {
  try {
    const {
      name,
      description,
      targetAmount,
      targetDate,
      savingType,
      event_slug,
      ticketTypeId,
      ticketType,
      ticketQuantity,
      additionalSpending,
      organizerId,
      cutoffDate,
      priority,
      reminderDays,
      isAutoPurchase,
    } = req.body;

    const goal = await createSavingsGoal(req.user.userId, {
      name,
      description,
      targetAmount,
      targetDate,
      savingType,
      event_slug,
      ticketTypeId,
      ticketType,
      ticketQuantity,
      additionalSpending,
      organizerId,
      cutoffDate,
      priority,
      reminderDays,
      isAutoPurchase,
    });
    res.json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get savings goals
export const getGoals = async (req, res) => {
  try {
    const goals = await getSavingsGoals(req.user.userId);
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update savings goal
export const updateGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const updates = req.body;
    const goal = await updateSavingsGoal(req.user.userId, goalId, updates);
    res.json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete savings goal
export const deleteGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const result = await deleteSavingsGoal(req.user.userId, goalId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Deposit money to savings
export const depositToSavingsGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { amount } = req.body;
    const result = await depositToSavings(req.user.userId, amount, goalId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Withdraw money from savings
export const withdrawFromSavingsGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { amount } = req.body;
    const result = await withdrawFromSavings(req.user.userId, amount, goalId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Handle PayChangu callback/webhook
export const paychanguCallback = async (req, res) => {
  try {
    const callbackData = req.body;
    console.log("Received PayChangu callback:", callbackData);
    const result = await handlePayChanguCallback(callbackData);
    res.json({ success: true, transaction: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get wallet summary (balance breakdown)
export const getWalletSummary = async (req, res) => {
  try {
    const wallet = await getWalletByUser(req.user.userId);
    const goals = await getSavingsGoals(req.user.userId);

    const totalSavings = goals.reduce(
      (sum, goal) => sum + goal.currentAmount,
      0
    );
    const completedGoals = goals.filter((goal) => goal.isCompleted).length;
    const activeGoals = goals.filter((goal) => !goal.isCompleted).length;

    const summary = {
      regularBalance: wallet.regularBalance,
      totalSavings,
      completedGoals,
      activeGoals,
      goals,
      currency: wallet.currency,
    };

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check if user can use savings features
export const getSavingsEligibility = async (req, res) => {
  try {
    const eligibility = await checkSavingsEligibility(req.user.userId);
    res.json(eligibility);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get available events for savings goals
export const getAvailableEvents = async (req, res) => {
  try {
    const events = await getAvailableEventsForSavings();
    res.json({
      status: "success",
      data: events,
      count: events.length
    });
  } catch (err) {
    res.status(500).json({ 
      status: "error", 
      message: err.message 
    });
  }
};

// Get available organizers for savings goals
export const getAvailableOrganizers = async (req, res) => {
  try {
    const organizers = await getAvailableOrganizersForSavings();
    res.json({
      status: "success",
      data: organizers,
      count: organizers.length
    });
  } catch (err) {
    res.status(500).json({ 
      status: "error", 
      message: err.message 
    });
  }
};

// Get events by specific organizer
export const getEventsByOrganizerController = async (req, res) => {
  try {
    const { organizerId } = req.params;
    const events = await getEventsByOrganizer(organizerId);
    res.json({
      status: "success",
      data: events,
      count: events.length
    });
  } catch (err) {
    res.status(500).json({ 
      status: "error", 
      message: err.message 
    });
  }
};

// Allocate funds from organizer savings to specific event
export const allocateFundsToEventController = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { event_slug, event_title, amount } = req.body;
    
    const allocation = await allocateFundsToEvent(req.user.userId, goalId, {
      event_slug,
      event_title,
      amount: parseFloat(amount)
    });
    
    res.json({
      status: "success",
      data: allocation,
      message: "Funds allocated successfully"
    });
  } catch (err) {
    res.status(400).json({ 
      status: "error", 
      message: err.message 
    });
  }
};

// Get available allocation amount for a goal
export const getAvailableAllocationAmountController = async (req, res) => {
  try {
    const { goalId } = req.params;
    const availableAmount = await getAvailableAllocationAmount(req.user.userId, goalId);
    res.json({
      status: "success",
      data: { availableAmount }
    });
  } catch (err) {
    res.status(400).json({ 
      status: "error", 
      message: err.message 
    });
  }
};
