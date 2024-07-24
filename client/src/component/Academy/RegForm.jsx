import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoOutlinedIcon from "@mui/icons-material/LooksTwoOutlined";

function Signup() {
  const [academydetails, setacademydetails] = useState({
    academy_name: "",
    academy_address: "",
    academy_city: "",
    academy_state: "",
    academy_pincode: "",
    academy_contactno: "",
  });
  const navigate = useNavigate();
  const [msg, setmsg] = useState("");

  const inputChange = (e) => {
    const { name, value } = e.target;
    setacademydetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const url = "http://localhost:5000/api/auth/academyreg";

  const handlesubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academy_name: academydetails.academy_name,
        academy_address: academydetails.academy_address,
        academy_city: academydetails.academy_city,
        academy_state: academydetails.academy_state,
        academy_pincode: academydetails.academy_pincode,
        academy_contactno: academydetails.academy_contactno,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setmsg(" Reg Succesfull ");
      toast.success('Registration successfully');
      navigate("/academysignup");
    } else {
      setmsg(" Reg Fail  ");
    }
  };

  return (
    <div>
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
              <a
                href="#"
                className="text-xs text-center text-gray-500 uppercase"
              >
                <LooksOneIcon fontSize="large" />
              </a>
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <a
                href="#"
                className="text-xs text-center text-gray-500 uppercase"
              >
                <LooksTwoOutlinedIcon fontSize="large" />
              </a>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <div className="mt-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                style={{ textAlign: "left" }}
              >
                Academy Name
              </label>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
                name="academy_name"
                onChange={inputChange}
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Address
                </label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
                name="academy_address"
                onChange={inputChange}
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  City
                </label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
                name="academy_city"
                onChange={inputChange}
              />
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  State
                </label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
                name="academy_state"
                onChange={inputChange}
              />
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Pincode
                </label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
                name="academy_pincode"
                onChange={inputChange}
              />
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Contact No
                </label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
                name="academy_contactno"
                onChange={inputChange}
              />
            </div>

            <div className="mt-8">
              <button
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                onClick={(e) => handlesubmit(e)}
              >
                Next
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
