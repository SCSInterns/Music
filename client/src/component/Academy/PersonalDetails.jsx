import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import LooksTwoOutlinedIcon from "@mui/icons-material/LooksTwoOutlined";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4OutlinedIcon from "@mui/icons-material/Looks4Outlined";
import Looks5OutlinedIcon from "@mui/icons-material/Looks5Outlined";

function Signup() {
  const { id } = useParams();
  const [personaldetails, setpersonaldetails] = useState({
    name: " ",
    address: " ",
    contactno: " ",
  });
  const navigate = useNavigate();
  const [msg, setmsg] = useState("");

  const inputChange = (e) => {
    const { name, value } = e.target;
    setpersonaldetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const url = `https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/addpersonaldetail/${id}`;

  const handlesubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (personaldetails.name.trim().length < 3) {
      setmsg("Name should be at least 3 characters long.");
      toast.error("Name should be at least 3 characters long.");
      return;
    }

    if (personaldetails.address.trim().length < 10) {
      setmsg("Address should be at least 10 characters long.");
      toast.error("Address should be at least 10 characters long.");
      return;
    }

    if (!/^\d{10}$/.test(personaldetails.contactno)) {
      setmsg("Contact number should be exactly 10 digits.");
      toast.error("Contact number should be exactly 10 digits.");
      return;
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: personaldetails.name,
        address: personaldetails.address,
        contactno: personaldetails.contactno,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setmsg(" Personal Details Add Succesfull ");
      toast.success("Personal Details Added successfully");
      navigate(`/academysignup/${id}`);
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
              Personal Details
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <p className="text-xs text-center text-gray-500 uppercase">
                <LooksOneOutlinedIcon fontSize="large" />
              </p>
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <p className="text-xs text-center text-gray-500 uppercase">
                <LooksTwoOutlinedIcon fontSize="large" />
              </p>
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <p className="text-xs text-center text-gray-500 uppercase">
                <Looks3Icon fontSize="large" />
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
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Full Name
                </label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
                name="name"
                onChange={inputChange}
              />
            </div>
            <div className="mt-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                style={{ textAlign: "left" }}
              >
                Address
              </label>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
                name="address"
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
                name="contactno"
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
