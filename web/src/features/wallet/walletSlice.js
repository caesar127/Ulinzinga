import { createSlice } from "@reduxjs/toolkit";
import { walletApiSlice } from "./walletApiSlice";

const initialState = {
  wallet: null,
  balance: 0,
  currency: "USD",
  transactions: [],
  transactionFilters: {
    type: "all",       
    status: "all",     
  },
  status: "idle",
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setTransactionFilters: (state, action) => {
      state.transactionFilters = { ...state.transactionFilters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // --- GET WALLET ---
      .addMatcher(
        walletApiSlice.endpoints.getUserWallet.matchFulfilled,
        (state, action) => {
          const wallet = action.payload?.data || action.payload;

          state.wallet = wallet;
          state.balance = wallet?.balance || 0;
          state.currency = wallet?.currency || "USD";
          state.status = "succeeded";
        }
      )

      // --- TRANSACTIONS ---
      .addMatcher(
        walletApiSlice.endpoints.getWalletTransactions.matchFulfilled,
        (state, action) => {
          const tx =
            action.payload?.data?.data ||
            action.payload?.data ||
            action.payload ||
            [];

          const uniqueTx = tx.filter(
            (item) => !state.transactions.some((ex) => ex.id === item.id)
          );

          state.transactions = [...state.transactions, ...uniqueTx];
          state.status = "succeeded";
        }
      )

      // --- ADD FUNDS / SPEND FUNDS ---
      .addMatcher(
        walletApiSlice.endpoints.addFundsToWallet.matchFulfilled,
        (state, action) => {
          const newData = action.payload?.data || action.payload;

          state.balance = newData?.balance ?? state.balance;
        }
      )
      .addMatcher(
        walletApiSlice.endpoints.spendFundsFromWallet.matchFulfilled,
        (state, action) => {
          const newData = action.payload?.data || action.payload;

          state.balance = newData?.balance ?? state.balance;
        }
      );
  },
});

export const { setTransactionFilters } = walletSlice.actions;
export default walletSlice.reducer;
