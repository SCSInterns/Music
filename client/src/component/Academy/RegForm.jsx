import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoOutlinedIcon from "@mui/icons-material/LooksTwoOutlined";
import Looks3OutlinedIcon from "@mui/icons-material/Looks3Outlined";
import Looks4OutlinedIcon from "@mui/icons-material/Looks4Outlined";
import Looks5OutlinedIcon from "@mui/icons-material/Looks5Outlined";
import { Country, State, City } from "country-state-city";

function Signup() {
  const [academydetails, setacademydetails] = useState({
    academy_name: "",
    academy_address: "",
    academy_city: "",
    academy_state: "",
    academy_pincode: "",
    academy_contactno: "",
    academy_gstno: "",
  });

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();

  function validateGST(gstNumber) {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
  }

  const handleStateChange = (event) => {
    const stateIsoCode = event.target.value;
    const state = State.getStatesOfCountry("IN").find(
      (s) => s.isoCode === stateIsoCode
    );

    if (state) {
      setSelectedState(state);
      setacademydetails((prev) => ({
        ...prev,
        academy_state: state.name,
        academy_city: "",
      }));
      setSelectedCity(null);
    } else {
      setSelectedState(null);
      setacademydetails((prev) => ({
        ...prev,
        academy_state: "",
        academy_city: "",
      }));
      setSelectedCity(null);
    }
  };

  const handleCityChange = (event) => {
    const city = City.getCitiesOfState("IN", selectedState?.isoCode).find(
      (c) => c.name === event.target.value
    );
    setSelectedCity(city);
    setacademydetails((prev) => ({
      ...prev,
      academy_city: city ? city.name : "",
    }));
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setacademydetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const url =
    "https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/academyreg";

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (academydetails.academy_name.trim().length < 3) {
      toast.error("Academy Name should be at least 3 characters long.");
      return;
    }
    if (academydetails.academy_address.trim().length < 10) {
      toast.error("Address should be at least 10 characters long.");
      return;
    }
    if (!/^\d{10}$/.test(academydetails.academy_contactno)) {
      toast.error("Contact Number should be exactly 10 digits.");
      return;
    }
    if (!/^\d{6}$/.test(academydetails.academy_pincode)) {
      toast.error("Pincode should be exactly 6 digits.");
      return;
    }
    if (
      academydetails.academy_gstno &&
      !validateGST(academydetails.academy_gstno)
    ) {
      toast.error("Invalid GST Number");
      return;
    }

    if (academydetails.academy_gstno == "") {
      setacademydetails((prev) => ({ ...prev, academy_gstno: "N/A" }));
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(academydetails),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success("Registration successful!");
      navigate(`/academytype/${data._id}`);
    } else {
      toast.error("Registration failed.");
    }
  };

  return (
    <div className="py-16">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div
          className="hidden lg:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Music Academy
          </h2>
          <p className="text-xl text-gray-600 text-center">
            Academy Registration
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <p className="text-xs text-center text-gray-500 uppercase">
              <LooksOneIcon fontSize="large" />
            </p>
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <p className="text-xs text-center text-gray-500 uppercase">
              <LooksTwoOutlinedIcon fontSize="large" />
            </p>
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <p className="text-xs text-center text-gray-500 uppercase">
              <Looks3OutlinedIcon fontSize="large" />
            </p>
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <p className="text-xs text-center text-gray-500 uppercase">
              <Looks4OutlinedIcon fontSize="large" />
            </p>
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <p className="text-xs text-center text-gray-500 uppercase">
              <Looks5OutlinedIcon fontSize="large" />
            </p>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
              Academy Name
            </label>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="text"
              name="academy_name"
              value={academydetails.academy_name}
              onChange={inputChange}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
              Address
            </label>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="text"
              name="academy_address"
              value={academydetails.academy_address}
              onChange={inputChange}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
              Country
            </label>
            <select
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              disabled
            >
              <option value="IN">India</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
              State
            </label>
            <select
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              onChange={handleStateChange}
            >
              <option value="">Select State</option>
              {State.getStatesOfCountry("IN").map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
              City
            </label>
            <select
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              // value={academydetails.academy_city}
              onChange={handleCityChange}
              disabled={!selectedState}
            >
              <option value="">Select City</option>
              {selectedState &&
                City.getCitiesOfState("IN", selectedState.isoCode).map(
                  (city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  )
                )}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
              Pincode
            </label>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="text"
              name="academy_pincode"
              value={academydetails.academy_pincode}
              onChange={inputChange}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
              Contact Number
            </label>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="text"
              name="academy_contactno"
              value={academydetails.academy_contactno}
              onChange={inputChange}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
              GST Number
            </label>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="text"
              name="academy_gstno"
              placeholder="Leave blank if you dont have GST Number"
              value={academydetails.academy_gstno}
              onChange={inputChange}
            />
          </div>

          <div className="mt-4">
            <button
              className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              onClick={handlesubmit}
            >
              Register Academy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
