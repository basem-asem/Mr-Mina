import { createSlice } from "@reduxjs/toolkit";
import en from "../../../public/locales/en/common.json";
import ar from "../../../public/locales/ar/common.json";

const initialState = {
  en: en,
  ar: ar,
};

export const TranslationSlice = createSlice({
  name: "Translation",
  initialState,
  reducers: {
    setEnglishTrans: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.en = action.payload;
    },
    setArabicTrans: (state, action) => {
      state.ar = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setEnglishTrans, setArabicTrans } = TranslationSlice.actions;

export default TranslationSlice.reducer;
