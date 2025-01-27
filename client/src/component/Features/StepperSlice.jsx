import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: 0,
};

const stepperSlice = createSlice({
  name: "stepper",
  initialState,
  reducers: {
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      state.currentStep -= 1;
    },
    resetStep: (state) => {
      state.currentStep = 0;
    },
  },
});

export const { nextStep, prevStep, resetStep } = stepperSlice.actions;

export default stepperSlice.reducer;
