import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/api";

// Load complete structure
export const fetchStructure = createAsyncThunk(
  "sections/fetchStructure",
  async (customerId) => {
    const res = await api.get(`/structure/full/${customerId}`);
    return res.data;
  }
);

export const createSection = createAsyncThunk(
  "sections/createSection",
  async (payload) => {
    const res = await api.post("/structure/sections", payload);
    return res.data;
  }
);

export const createSubsection = createAsyncThunk(
  "sections/createSubsection",
  async (payload) => {
    const res = await api.post("/structure/subsections", payload);
    return res.data;
  }
);

export const assignItem = createAsyncThunk(
  "sections/assignItem",
  async (payload) => {
    const res = await api.post("/structure/assign", payload);
    return res.data;
  }
);

export const updateAssignedItem = createAsyncThunk(
  "sections/updateAssignedItem",
  async ({ id, data }) => {
    const res = await api.patch(`/structure/assigned/${id}`, data);
    return res.data;
  }
);

export const deleteAssignedItem = createAsyncThunk(
  "sections/deleteAssignedItem",
  async (id) => {
    await api.delete(`/structure/assigned/${id}`);
    return id;
  }
);

const sectionsSlice = createSlice({
  name: "sections",
  initialState: {
    structure: [],
    activeSection: null,
    activeSub: null,
    loading: false,
    error: null,
  },

  reducers: {
    setActiveSection(state, action) {
      state.activeSection = action.payload;
      state.activeSub = null;
    },

    setActiveSub(state, action) {
      state.activeSub = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      // fetch full structure
      .addCase(fetchStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.structure = action.payload;
      })
      .addCase(fetchStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // after these actions, UI refetches structure
      .addCase(createSection.fulfilled, () => {})
      .addCase(createSubsection.fulfilled, () => {})
      .addCase(assignItem.fulfilled, () => {})
      .addCase(updateAssignedItem.fulfilled, () => {})
      .addCase(deleteAssignedItem.fulfilled, () => {});
  },
});

// Selector: Grand Total
export const selectGrandTotal = (state) => {
  let total = 0;

  state.sections.structure.forEach((sec) => {
    sec.items?.forEach((it) => {
      total += (it.quantity || it.qty) * (it.rate || 0);
    });

    sec.subsections?.forEach((sub) =>
      sub.items?.forEach((it) => {
        total += (it.quantity || it.qty) * (it.rate || 0);
      })
    );
  });

  return total;
};

export const { setActiveSection, setActiveSub } = sectionsSlice.actions;

export default sectionsSlice.reducer;
