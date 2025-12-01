import { apiSlice } from "../../api/apiSlice";

const WALLET_URL = "/api/user/wallet";

export const walletApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user wallet
    getUserWallet: builder.query({
      query: () => `${WALLET_URL}`,
      providesTags: ["Wallet"],
    }),

    // Add funds to wallet
    addFundsToWallet: builder.mutation({
      query: ({ amount, description }) => ({
        url: `${WALLET_URL}/deposit`,
        method: "POST",
        body: { amount, description },
      }),
      invalidatesTags: ["Wallet"],
    }),

    // Spend funds from wallet
    spendFundsFromWallet: builder.mutation({
      query: ({ amount, description, eventId }) => ({
        url: `${WALLET_URL}/debit`,
        method: "POST",
        body: { amount, description, eventId },
      }),
      invalidatesTags: ["Wallet"],
    }),

    // Get wallet transactions
    getWalletTransactions: builder.query({
      query: () => `${WALLET_URL}/transactions`,
      providesTags: ["Wallet", "Transactions"],
    }),

    // Get wallet summary (enhanced)
    getWalletSummary: builder.query({
      query: () => `${WALLET_URL}/summary`,
      providesTags: ["Wallet"],
    }),

    // Transfer money to organizer/vendor
    transferMoney: builder.mutation({
      query: ({ toUserId, toAccountType, amount, description, eventId }) => ({
        url: `${WALLET_URL}/transfer`,
        method: "POST",
        body: { toUserId, toAccountType, amount, description, eventId },
      }),
      invalidatesTags: ["Wallet"],
    }),

    // Savings Goals Management
    createSavingsGoal: builder.mutation({
      query: (goalData) => ({
        url: `${WALLET_URL}/savings/goals`,
        method: "POST",
        body: goalData,
      }),
      invalidatesTags: ["Wallet", "Savings"],
    }),

    getSavingsGoals: builder.query({
      query: () => `${WALLET_URL}/savings/goals`,
      providesTags: ["Savings"],
    }),

    updateSavingsGoal: builder.mutation({
      query: ({ goalId, ...updates }) => ({
        url: `${WALLET_URL}/savings/goals/${goalId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Savings", "Wallet"],
    }),

    deleteSavingsGoal: builder.mutation({
      query: (goalId) => ({
        url: `${WALLET_URL}/savings/goals/${goalId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Savings", "Wallet"],
    }),

    // Savings Operations
    depositToSavings: builder.mutation({
      query: ({ goalId, amount }) => ({
        url: `${WALLET_URL}/savings/goals/${goalId}/deposit`,
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Wallet", "Savings"],
    }),

    withdrawFromSavings: builder.mutation({
      query: ({ goalId, amount }) => ({
        url: `${WALLET_URL}/savings/goals/${goalId}/withdraw`,
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Wallet", "Savings"],
    }),

    // Handle PayChangu payment callback
    handlePaymentCallback: builder.mutation({
      query: (callbackData) => ({
        url: `/api/user/wallet/paychangu/callback`,
        method: "POST",
        body: callbackData,
      }),
      invalidatesTags: ["Wallet"],
    }),
  }),
});

export const {
  useGetUserWalletQuery,
  useAddFundsToWalletMutation,
  useSpendFundsFromWalletMutation,
  useGetWalletTransactionsQuery,
  useGetWalletSummaryQuery,
  useTransferMoneyMutation,
  useCreateSavingsGoalMutation,
  useGetSavingsGoalsQuery,
  useUpdateSavingsGoalMutation,
  useDeleteSavingsGoalMutation,
  useDepositToSavingsMutation,
  useWithdrawFromSavingsMutation,
  useHandlePaymentCallbackMutation,
} = walletApiSlice;
