import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sections: [],         // [{ name, subsections: [{ name, items: [{id,title,rate,qty}]}] }]
  activeSection: null,  // index
  activeSubsection: null, // index
};

const sectionsSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {
    addSection(state, action) {
      state.sections.push({
        name: action.payload,
        subsections: [],
      });
    },

    addSubsection(state, action) {
      const { sectionIndex, name } = action.payload;
      state.sections[sectionIndex].subsections.push({
        name,
        items: [],
      });
    },

    setActiveSection(state, action) {
      state.activeSection = action.payload;
      state.activeSubsection = null;
    },

    setActiveSubsection(state, action) {
      state.activeSubsection = action.payload;
    },

    addItem(state, action) {
      const { id, title, rate, qty } = action.payload;

      if (state.activeSection === null) return;
      
      // SUBSECTION SELECTED → Add inside subsection
      if (state.activeSubsection !== null) {
        state.sections[state.activeSection]
          .subsections[state.activeSubsection]
          .items.push({ id, title, rate, qty });
        return;
      }

      // NO SUBSECTION SELECTED → Add directly inside section
      state.sections[state.activeSection].items ??= [];
      state.sections[state.activeSection].items.push({ id, title, rate, qty });
    },

    updateItem(state, action) {
      const { sectionIndex, subIndex, itemIndex, rate, qty } = action.payload;

      let target;
      if (subIndex !== null) {
        target = state.sections[sectionIndex].subsections[subIndex].items[itemIndex];
      } else {
        target = state.sections[sectionIndex].items[itemIndex];
      }

      if (target) {
        target.rate = rate;
        target.qty = qty;
      }
    },

    deleteItem(state, action) {
      const { sectionIndex, subIndex, itemIndex } = action.payload;

      if (subIndex !== null) {
        state.sections[sectionIndex].subsections[subIndex].items.splice(itemIndex, 1);
      } else {
        state.sections[sectionIndex].items.splice(itemIndex, 1);
      }
    },
  },
});

export const {
  addSection,
  addSubsection,
  setActiveSection,
  setActiveSubsection,
  addItem,
  updateItem,
  deleteItem,
} = sectionsSlice.actions;

export default sectionsSlice.reducer;
