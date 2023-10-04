import { createSlice } from "@reduxjs/toolkit";

const matchSlice = createSlice({
  name: "match",
  initialState: {
    matchRefresh: false,
  },

  reducers: {
    setMatchRefresh: (state, action) => {
      state.matchRefresh = action.payload;
    },
  },
});

export const { setMatchRefresh } = matchSlice.actions;
export default matchSlice.reducer;
