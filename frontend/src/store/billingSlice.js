import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sections: [], 
  activeSection: null, // index
  activeSub: null,     // index
  nextItemId: 1,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    addSection(state, action) {
      const name = action.payload?.trim();
      if (!name) return;
      state.sections.push({ name, subsections: [], items: [] });
      // Auto-select new section
      state.activeSection = state.sections.length - 1;
      state.activeSub = null;
    },
    addSubsection(state, action) {
      const name = action.payload?.trim();
      const sec = state.activeSection;
      if (sec === null || sec === undefined || !name) return;
      
      state.sections[sec].subsections.push({ name, items: [] });
      // Auto-select new subsection
      state.activeSub = state.sections[sec].subsections.length - 1;
    },
    setActiveSection(state, action) {
      state.activeSection = action.payload;
      state.activeSub = null; 
    },
    setActiveSub(state, action) {
      state.activeSub = action.payload;
    },
    // THE MAIN ADD ITEM FUNCTION
    addItem(state, action) {
      const { name, qty, rate } = action.payload;
      const secIdx = state.activeSection;
      
      if (secIdx === null) return; // Should be blocked by UI, but safety check

      const newItem = {
        id: state.nextItemId++,
        name,
        qty: Number(qty) || 0,
        rate: Number(rate) || 0,
        total: (Number(qty) || 0) * (Number(rate) || 0)
      };

      // If subsection is active, add there. Else add to Section Global items.
      if (state.activeSub !== null) {
        state.sections[secIdx].subsections[state.activeSub].items.push(newItem);
      } else {
        state.sections[secIdx].items.push(newItem);
      }
    },
    editItem(state, action) {
      const { sectionIdx, subIdx, itemId, qty, rate } = action.payload;
      const sec = state.sections[sectionIdx];
      if (!sec) return;

      const list = (subIdx !== null && subIdx !== undefined)
        ? sec.subsections[subIdx]?.items 
        : sec.items;

      const item = list?.find((x) => x.id === itemId);
      if (item) {
        item.qty = Number(qty);
        item.rate = Number(rate);
        item.total = item.qty * item.rate;
      }
    },
    deleteItem(state, action) {
      const { sectionIdx, subIdx, itemId } = action.payload;
      const sec = state.sections[sectionIdx];
      if (!sec) return;

      if (subIdx !== null && subIdx !== undefined) {
        sec.subsections[subIdx].items = sec.subsections[subIdx].items.filter(x => x.id !== itemId);
      } else {
        sec.items = sec.items.filter(x => x.id !== itemId);
      }
    }
  },
});

export const {
  addSection,
  addSubsection,
  setActiveSection,
  setActiveSub,
  addItem,
  editItem,
  deleteItem,
} = billingSlice.actions;

// Selectors
export const selectSectionSubtotal = (state, sectionIdx) => {
  const sec = state.billing.sections[sectionIdx];
  if (!sec) return 0;
  
  const sumItems = (arr) => arr.reduce((acc, it) => acc + (it.qty * it.rate), 0);
  
  let total = sumItems(sec.items); // Section global items
  sec.subsections.forEach(sub => {
    total += sumItems(sub.items); // Subsection items
  });
  
  return total;
};

export default billingSlice.reducer;