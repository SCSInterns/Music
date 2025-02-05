import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  eventName: "",
  occurrence: "Single",
  multipleDates: false,
  timeSameAllDays: false,
  times: {},
  venueSameForAll: false,
  description: "",
  eventCategory: "",
  eventDates: [],
  venue: {
    venueName: "",
    venueCity: "",
    venueState: "",
    pincode: "",
    mapLink: "",
    venueid: "",
  },
  venueid: "",
  venuetype: "",
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateFormData } = eventSlice.actions;
export default eventSlice.reducer;
