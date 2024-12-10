import { Check } from "lucide-react";

export default function PricingDetails() {
  const plans = [
    {
      name: "Basic",
      price: "₹ 4000 ",
      description: "Perfect for your musical journey",
      features: [
        "Student Hub",
        "Pay Wise",
        "Class Flow",
        "Website Pilot",
        "Attendance Ease",
        "White Labeling",
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 py-20">
      <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
        Why Wait? Join Today and Experience the Best!
      </h2>
      <div className="flex flex-col md:flex-row gap-12 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Column - Pricing and CTA */}
        <div className="flex-1 p-8 space-y-8 border-r border-gray-200 bg-gray-50">
          <h1 className="text-4xl font-bold text-gray-800">{plans[0].name}</h1>
          <div className="flex items-baseline space-x-1 justify-center">
            <span className="text-4xl font-bold text-green-600 lg:ml-10">
              {plans[0].price}
            </span>
            <span className="text-sm text-gray-500">/ year</span>
          </div>
          <p className="text-gray-700 text-center mb-6">
            {plans[0].description}
          </p>
          <button className="px-8 py-2 rounded-full bg-black text-white hover:bg-black/90 transition-colors shadow-lg transform hover:scale-105">
            Sign up
          </button>
        </div>

        {/* Right Column - Details */}
        <div className="flex-1 p-8 space-y-8">
          {/* Features Section */}
          <div>
            <h2 className="text-xl font-semibold mb-5 text-gray-800 ">
              Features
            </h2>
            <ul className="space-y-4">
              {plans[0].features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
