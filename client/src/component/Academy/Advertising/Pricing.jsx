import React, { useEffect, useState } from "react";
import Model from "../../../static/Images/Advertise.svg";
import Token from "../../Token/Token";
import { Button } from "@mui/material";
import AdvertisingCard from "./AdvertiseCard";
import { io } from "socket.io-client";

function Pricing({ onUpdate }) {
  const [advertiseList, setAdvertiseList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = Token();
  const role = sessionStorage.getItem("role");
  const socket = React.useRef(null);
  const fetchdata = async () => {
    try {
      const url =
        "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/allentries";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      const data = await response.json();
      setAdvertiseList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const startSocket = () => {
    socket.current.on("NewAdvertisePlan", (newEntry) => {
      fetchdata();
    });
  };

  useEffect(() => {
    socket.current = io("http://localhost:5000");
    startSocket();
    return () => {
      socket.current.off("NewAdvertisePlan");
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchdata();
  }, []);

  console.log(advertiseList);

  const city = sessionStorage.getItem("city"); // Get the city name from session storage

  // Filter the advertisements to include only those where the city count exists
  const filteredData = advertiseList.map((advertise) => {
    // Find the specific city's count
    const cityData = advertise.cityCounts.find((count) => count.city === city);

    // Add the city's count to the advertisement object, defaulting to 0 if not found
    return {
      ...advertise,
      currentcityCount: cityData ? cityData.count : 0,
    };
  });

  // Log or process the data
  console.log(filteredData);

  return (
    <>
      <div className=" text-black py-2 rounded-lg shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <div className="mb-6 md:mb-0">
            <img
              src={Model}
              alt="Model"
              className="w-72 h-72 md:w-80 md:h-80 object-contain mx-auto"
            />
          </div>

          <div className="text-center md:text-left md:ml-10">
            <h1 className="text-4xl font-extrabold mb-4 leading-tight">
              Advertise Smarter, Reach Farther
            </h1>
            <p className="text-lg md:text-xl font-medium w-full md:w-3/4 mx-auto md:mx-0">
              Explore powerful advertising options tailored to boost visibility,
              engagement, and growth. Choose a plan that fits your goals!
            </p>

            <div class="mt-10">
              <p class="text-xl font-medium">
                <span class="text-blue-500">Select Plan</span>
                <span class="text-gray-500"> &gt; </span>
                <span class="text-gray-500">Proceed Payment</span>
                <span class="text-gray-500"> &gt; </span>
                <span class="text-gray-500">Upload Content</span>
                <span class="text-gray-500"> &gt; </span>
                <span class="text-gray-500">Get Advertise</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-8">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-center">Advertising Plans</h2>
          <p className="text-lg text-center mt-2">
            Choose advertise plan that fits your goals!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {filteredData.map((item) => (
            <AdvertisingCard key={item._id} data={item} onUpdate={onUpdate} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Pricing;
