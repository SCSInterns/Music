import { Check } from "lucide-react";
import React, { useState } from "react";
import PayOptions from "./PayOptions";

function AdvertisingCard({ data }) {
  const { name, price, limit, section, features, currentcityCount } = data;
  const [open, setOpen] = useState(false);

  // Calculate available slots
  const availableSlots = limit - currentcityCount;

  // Handle payment option selection
  const handlePayment = () => {
    setOpen(true); // Open the PayOptions dialog
  };

  return (
    <>
      {/* Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg relative flex flex-col justify-between h-full hover:shadow-2xl border-blue-900 border transition duration-300">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{name}</h2>

        {/* Section */}
        <p className="text-sm font-medium text-blue-500 mb-2">
          Section: {section}
        </p>

        {/* Price */}
        <p className="text-lg font-semibold text-gray-700 mb-2">
          Price: <span className="text-green-600">₹ {price}</span> /month
        </p>

        {/* Slots Remaining */}
        <p className="text-sm font-medium text-gray-500 mb-4">
          Slots Remaining:{" "}
          <span
            className={`font-bold ${
              availableSlots > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {availableSlots}
          </span>
        </p>

        {/* Features List */}
        <div className="mb-10 flex-grow">
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Features:
          </h3>
          <ul className="pl-5 space-y-2 text-left">
            {features.map((feature, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 flex items-center"
              >
                <Check className="h-5 w-5 text-green-600 mr-3" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Select Plan Button */}
        <button
          className={`absolute bottom-4 right-4 py-2 px-6 rounded-lg shadow-lg transition duration-300 ${
            availableSlots === 0
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-blue-800 text-white hover:bg-blue-900"
          }`}
          disabled={availableSlots === 0}
          onClick={handlePayment}
        >
          Select Plan
        </button>
      </div>

      {/* Payment Options Dialog */}
      {open && (
        <PayOptions open={open} onClose={() => setOpen(false)} data={data} />
      )}
    </>
  );
}

export default AdvertisingCard;
