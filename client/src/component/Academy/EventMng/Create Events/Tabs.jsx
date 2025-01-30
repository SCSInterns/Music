import React, { useEffect, useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useSelector, useDispatch } from "react-redux";
import { nextStep, prevStep } from "../../../Features/StepperSlice";
import { setVenues } from "../../../Features/VenuesSlice";
import CreateEventForm from "../Create Events/Steps/CreateEventForm";
import CreateLocation from "./Steps/CreateLocation";
import Token from "../../../Token/Token";
import { toast } from "react-toastify";
import CreateSeatLayout from "./Steps/CreateSeatLayout";
import CreateTickets from "./Steps/CreateTickets";

function Stepper() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.stepper.currentStep);
  const currentVenues = useSelector((state) => state.venues.venues);
  const token = Token();
  useEffect(() => {
    const fetchVenues = async () => {
      const response = await fetch(
        "http://localhost:5000/api/auth/getvenuedetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            role: sessionStorage.getItem("role"),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(setVenues(data));
      } else {
        toast.error("Error fetching venues");
      }
    };

    fetchVenues();
  }, []);

  const steps = [
    "Event Data",
    "Seat Layout",
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
        {steps[currentStep] === "Location" && (
          <div>
            <CreateLocation />
          </div>
        )}
        {steps[currentStep] === "Seat Layout" && (
          <div>
            <CreateSeatLayout />
          </div>
        )}
        {steps[currentStep] === "Ticketing" && (
          <div>
            <CreateTickets />
          </div>
        )}
      </div>
    </div>
  );
}

export default Stepper;
