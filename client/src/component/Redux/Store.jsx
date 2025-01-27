import { configureStore } from "@reduxjs/toolkit";
import stepperReducer from "../Features/StepperSlice";
import eventReducer from "../Features/EventsSlice";

export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
    event: eventReducer,
  },
});
