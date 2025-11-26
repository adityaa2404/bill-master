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

// Load customer-specific saved rates
export const fetchCustomerRates = createAsyncThunk(
  "sections/fetchCustomerRates",
  async (customerId) => {
    const res = await api.get(`/structure/rates/${customerId}`);
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

export const deleteSection = createAsyncThunk(
  "sections/deleteSection",
  async (sectionId) => {
    await api.delete(`/structure/sections/${sectionId}`);
    return sectionId;
  }
);

export const deleteSubsection = createAsyncThunk(
  "sections/deleteSubsection",
  async (subId) => {
    await api.delete(`/structure/subsections/${subId}`);
    return subId;
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

    saving: false,
    saveStatus: "Saved",

    customerRates: {},
  },

  reducers: {
    setActiveSection(state, action) {
      state.activeSection = action.payload;
      state.activeSub = null;
    },

    setActiveSub(state, action) {
      state.activeSub = action.payload;
    },

    setSaving(state, action) {
      state.saving = action.payload;
      state.saveStatus = action.payload ? "Saving..." : "Saved";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchStructure.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.structure = action.payload;
      })
      .addCase(fetchStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchCustomerRates.fulfilled, (state, action) => {
        state.customerRates = {};
        action.payload.forEach((r) => {
          const itemId =
            typeof r.itemId === "string" ? r.itemId : r.itemId?._id;

          if (itemId) {
            state.customerRates[itemId] = r.rate;
          }
        });
      })

      .addCase(assignItem.fulfilled, () => {})
      .addCase(updateAssignedItem.fulfilled, () => {})
      .addCase(deleteAssignedItem.fulfilled, () => {})
      .addCase(createSection.fulfilled, () => {})
      .addCase(createSubsection.fulfilled, () => {})
      .addCase(deleteSection.fulfilled, () => {})
      .addCase(deleteSubsection.fulfilled, () => {});
  },
});

export const selectGrandTotal = (state) => {
  let total = 0;

  state.sections.structure.forEach((sec) => {
    sec.items?.forEach((it) => {
      total += (it.quantity || 0) * (it.rate || 0);
    });

    sec.subsections?.forEach((sub) =>
      sub.items?.forEach((it) => {
        total += (it.quantity || 0) * (it.rate || 0);
      })
    );
  });

  return total;
};

export const {
  setActiveSection,
  setActiveSub,
  setSaving,
} = sectionsSlice.actions;

export default sectionsSlice.reducer;
