import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3OutlinedIcon from '@mui/icons-material/Looks3Outlined';
import Looks4OutlinedIcon from '@mui/icons-material/Looks4Outlined';

function Signup() {
  const { id } = useParams();
  const [franchisedetails, setfranchisedetails] = useState({
    Franchise: " ",
    Franchise_Name: " ",
    Franchise_Address: " ",
  });
  const navigate = useNavigate();
  const [msg, setmsg] = useState("");

  const inputChange = (e) => {
    const { name, value } = e.target;
    setfranchisedetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const url = `http://localhost:5000/api/auth/addfranchisedetails/${id}`;

  const handlesubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Franchise: franchisedetails.Franchise,
        Franchise_Name: franchisedetails.Franchise_Name,
        Franchise_Address:franchisedetails.Franchise_Address,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setmsg(" Franchise Details Add Succesfull ");
      toast.success(" Details Added successfully");
      console.log(data._id)
      navigate(`/personaldetails/${id}`);
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
              Franchise Details
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <a
                href="#"
                className="text-xs text-center text-gray-500 uppercase"
              >
                <LooksOneOutlinedIcon fontSize="large" />
              </a>
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <a
                href="#"
                className="text-xs text-center text-gray-500 uppercase"
              >
                <LooksTwoIcon fontSize="large" />
              </a>
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <a
                href="#"
                className="text-xs text-center text-gray-500 uppercase"
              >
                <Looks3OutlinedIcon fontSize="large" />
              </a>
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <a
                href="#"
                className="text-xs text-center text-gray-500 uppercase"
              >
                <Looks4OutlinedIcon fontSize="large" />
              </a>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  No of Franchise
                </label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="Number"
                name="Franchise"
                onChange={inputChange}
                min={0}
              />
            </div>
            <div className="mt-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                style={{ textAlign: "left" }}
              >
                Franchise Name
              </label>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
                name="Franchise_Name"
                onChange={inputChange}
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Franchise Address
                </label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
                name="Franchise_Address"
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