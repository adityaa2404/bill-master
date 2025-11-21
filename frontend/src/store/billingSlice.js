import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sections: [],
  activeSection: null,
  activeSub: null,
  nextItemId: 1,

  // CUSTOMER + INVOICE
  customer: {
    name: "",
    phone: "",
    email: "",
    address: "",
  },

  invoiceNumber: "",
  invoiceDate: "",
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    /* ---------------------- CUSTOMER ---------------------- */
    setCustomer(state, action) {
      state.customer = { ...state.customer, ...action.payload };
    },

    setInvoiceNumber(state, action) {
      state.invoiceNumber = action.payload;
    },

    setInvoiceDate(state, action) {
      state.invoiceDate = action.payload;
    },

    /* ---------------------- SECTIONS ---------------------- */
    addSection(state, action) {
      const name = action.payload?.trim();
      if (!name) return;

      state.sections.push({
        name,
        subsections: [],
        items: [],
      });

      state.activeSection = state.sections.length - 1;
      state.activeSub = null;
    },

    addSubsection(state, action) {
      const name = action.payload?.trim();
      const sec = state.activeSection;

      if (sec === null || sec === undefined || !name) return;

      state.sections[sec].subsections.push({
        name,
        items: [],
      });

      state.activeSub =
        state.sections[sec].subsections.length - 1;
    },

    setActiveSection(state, action) {
      state.activeSection = action.payload;
      state.activeSub = null;
    },

    setActiveSub(state, action) {
      state.activeSub = action.payload;
    },

    /* ---------------------- ITEMS ---------------------- */
    addItem(state, action) {
      const { name, qty, rate } = action.payload;
      const secIdx = state.activeSection;

      if (secIdx === null || secIdx === undefined) return;

      const item = {
        id: state.nextItemId++,
        name,
        qty: Number(qty) || 0,
        rate: Number(rate) || 0,
        total: (Number(qty) || 0) * (Number(rate) || 0),
      };

      if (state.activeSub !== null) {
        state.sections[secIdx].subsections[state.activeSub].items.push(item);
      } else {
        state.sections[secIdx].items.push(item);
      }
    },

    editItem(state, action) {
      const { sectionIdx, subIdx, itemId, qty, rate } = action.payload;
      const sec = state.sections[sectionIdx];
      if (!sec) return;

      const list =
        subIdx !== null && subIdx !== undefined
          ? sec.subsections[subIdx].items
          : sec.items;

      const item = list.find((x) => x.id === itemId);
      if (!item) return;

      item.qty = Number(qty);
      item.rate = Number(rate);
      item.total = item.qty * item.rate;
    },

    deleteItem(state, action) {
      const { sectionIdx, subIdx, itemId } = action.payload;
      const sec = state.sections[sectionIdx];
      if (!sec) return;

      if (subIdx !== null && subIdx !== undefined) {
        sec.subsections[subIdx].items = sec.subsections[subIdx].items.filter(
          (i) => i.id !== itemId
        );
      } else {
        sec.items = sec.items.filter((i) => i.id !== itemId);
      }
    },

    /* ---------------------- LOAD FROM DB ---------------------- */
    loadBill(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

/* ---------------------- SELECTORS ---------------------- */
export const selectSectionSubtotal = (state, sectionIdx) => {
  const sec = state.billing.sections[sectionIdx];
  if (!sec) return 0;

  const sum = (arr) => arr.reduce((acc, i) => acc + i.total, 0);

  let total = sum(sec.items);
  sec.subsections.forEach((sub) => (total += sum(sub.items)));

  return total;
};

export const selectGrandTotal = (state) =>
  state.billing.sections.reduce(
    (acc, _, idx) => acc + selectSectionSubtotal(state, idx),
    0
  );

/* ---------------------- EXPORTS ---------------------- */
export const {
  addSection,
  addSubsection,
  setActiveSection,
  setActiveSub,
  addItem,
  editItem,
  deleteItem,
  setCustomer,
  setInvoiceNumber,
  setInvoiceDate,
  loadBill,
} = billingSlice.actions;

export default billingSlice.reducer;
