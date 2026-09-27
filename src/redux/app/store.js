import { configureStore } from "@reduxjs/toolkit";
import TranslationReducer from "../features/TranslationSlice";
import PrintingReducer from "../features/PrintingSlice";

export const store = configureStore({
  reducer: {
    Translation: TranslationReducer,
    boolean: PrintingReducer,

  },
});
