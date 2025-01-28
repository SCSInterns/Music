import { createSlice } from "@reduxjs/toolkit";

const venueSlice = createSlice({
  name: "venues",
  initialState: {
    venues: [],
  },
  reducers: {
    setVenues: (state, action) => {
      state.venues = action.payload;
    },
  },
});

export const { setVenues } = venueSlice.actions;
export default venueSlice.reducer;
