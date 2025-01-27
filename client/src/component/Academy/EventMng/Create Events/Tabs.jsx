import React, { useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useSelector, useDispatch } from "react-redux";
import { nextStep, prevStep } from "../../../Features/StepperSlice";
import CreateEventForm from "../Create Events/Steps/CreateEventForm";

function Stepper() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.stepper.currentStep);

  const steps = [
    "Event Data",
    "Location",
    "Form",
    "Ticketing",
    "Payment",
    "Extra Details",
    "Publish",
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      dispatch(nextStep());
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      dispatch(prevStep());
    }
  };

  return (
    <div className="w-full p-8">
      <div className="relative w-full flex items-center justify-center">
        {/* Navigation Buttons */}
        <button
          className={`px-2 py-2 mr-4 flex items-center justify-center rounded-full font-medium shadow ${
            currentStep === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <NavigateBeforeIcon />
        </button>

        {/* Stepper with Completion Line */}
        <div className="relative flex-grow max-w-4xl mx-8">
          {/* Completion Line */}
          <div className="absolute top-1/3 left-0 w-full h-1 bg-gray-300 -translate-y-1/2"></div>
          <div
            className="absolute top-1/3 left-0 h-1 bg-blue-500 -translate-y-1/2 transition-all duration-300"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          ></div>

          {/* Steps */}
          <div className="relative z-10 flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Step Indicator */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                    index <= currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                {/* Step Name */}
                <div
                  className={`mt-2 text-sm font-medium ${
                    index <= currentStep ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className={`px-2 py-2 ml-4 flex items-center justify-center rounded-full font-medium shadow ${
            currentStep === steps.length - 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
        >
          <NavigateNextIcon />
        </button>
      </div>

      {/* Step Content */}
      <div className="text-center mt-8">
        <h2 className="text-xl mb-2 font-semibold text-gray-800">
          {steps[currentStep]}
        </h2>
        {steps[currentStep] === "Event Data" && (
          <div>
            <CreateEventForm />
          </div>
        )}
      </div>
    </div>
  );
}

export default Stepper;
