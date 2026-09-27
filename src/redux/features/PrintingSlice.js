import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: false,
};

const booleanSlice = createSlice({
  name: 'boolean',
  initialState,
  reducers: {
    setTrue: (state) => {
      state.value = true;
    },
    setFalse: (state) => {
      state.value = false;
    },
    toggle: (state) => {
      state.value = !state.value;
    },
  },
});

export const { setTrue, setFalse, toggle } = booleanSlice.actions;
export default booleanSlice.reducer;
