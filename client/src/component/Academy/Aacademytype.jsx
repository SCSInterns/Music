import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3OutlinedIcon from "@mui/icons-material/Looks3Outlined";
import Looks4OutlinedIcon from "@mui/icons-material/Looks4Outlined";
import Looks5OutlinedIcon from "@mui/icons-material/Looks5Outlined";

function AcademyTypeForm() {
  const { id } = useParams();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const academyTypes = ["Dance", , "Singing", "Music", "Art"];

  const handleCheckboxChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const url = `https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/addacademytype/${id}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedTypes.length === 0) {
      setMsg("Please select at least one academy type.");
      toast.error("Please select at least one academy type.");
      return;
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: selectedTypes }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Academy types added successfully.");
      navigate(`/personaldetails/${id}`);
    } else {
      setMsg("Failed to add academy types.");
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
              Select Academy Type
            </h2>
            <p className="text-xl text-gray-600 text-center">
              Choose the type(s) of academy
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <p className="text-xs text-center text-gray-500 uppercase">
                <LooksOneOutlinedIcon fontSize="large" />
              </p>
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <p className="text-xs text-center text-gray-500 uppercase">
                <LooksTwoIcon fontSize="large" />
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

            <div className="mt-4 space-y-3">
              {academyTypes.map((type) => (
                <label key={type} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    value={type}
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700">{type}</span>
                </label>
              ))}
            </div>

            <div className="mt-8">
              <button
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
            {msg && <p className="mt-4 text-red-600 text-center">{msg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcademyTypeForm;
