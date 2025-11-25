import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/api";

export const fetchItems = createAsyncThunk("items/fetchAll", async () => {
  const res = await api.get("/items");
  return res.data;
});

export const createItem = createAsyncThunk("items/create", async (data) => {
  const res = await api.post("/items", data);
  return res.data;
});

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default itemsSlice.reducer;
