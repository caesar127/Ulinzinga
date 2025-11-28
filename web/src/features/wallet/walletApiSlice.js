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
        url: `${WALLET_URL}/credit`,
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
  }),
});

export const {
  useGetUserWalletQuery,
  useAddFundsToWalletMutation,
  useSpendFundsFromWalletMutation,
  useGetWalletTransactionsQuery,
} = walletApiSlice;
