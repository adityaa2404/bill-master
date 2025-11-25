import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/api";

// get all customers (Customers page)
export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async () => {
    const res = await api.get("/customers");
    return res.data;
  }
);

// create customer (from modal)
export const createCustomer = createAsyncThunk(
  "customers/create",
  async (data) => {
    const res = await api.post("/customers", data);
    return res.data;
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    list: [],
    selectedCustomer: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCustomer(state, action) {
      state.selectedCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export const { setSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;
