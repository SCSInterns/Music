import { configureStore } from "@reduxjs/toolkit";
import stepperReducer from "../Features/StepperSlice";
import eventReducer from "../Features/EventsSlice";
import locationReducer from "../Features/LocationSlice";
import venueReducer from "../Features/VenuesSlice";

export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    event: eventReducer,
    location: locationReducer,
    venues: venueReducer,
  },
});
