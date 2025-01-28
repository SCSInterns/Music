import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  venuename: "",
  city: "",
  state: "",
  pincode: "",
  maplink: "",
  country: "IN",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    updatelocation: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updatelocation } = locationSlice.actions;
export default locationSlice.reducer;
