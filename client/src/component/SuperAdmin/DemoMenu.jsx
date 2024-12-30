import React, { useState, useEffect } from "react";
import DemoInquiry from "./DemoInquiry";
import PositiveFeedback from "./PositiveFeedback";
import NegativeFeedback from "./NegativeFeedback";
import { io } from "socket.io-client";
import Token from "../Token/Token";
import { toast } from "react-toastify";

const TopNavbar = () => {
  const [activeContent, setActiveContent] = useState("New Inquiry");
  const [inquiryData, setInquiryData] = useState([]);
  const role = sessionStorage.getItem("role");
  const token = Token();
  const socket = React.useRef(null);

  const getData = async () => {
    try {
      const url = "http://localhost:5000/api/superadmin/getdemodata";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ role }),
      });
      const data = await response.json();

      if (response.ok) {
        setInquiryData(data);
      } else {
        toast.error(data.msg || "Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    socket.current = io("http://localhost:5000/");
    socket.current.on("newDemoInquiry", (newEntry) => {
      setInquiryData((prevEntries) => [newEntry, ...prevEntries]);
    });

    return () => {
      socket.current.off("newDemoInquiry");
      socket.current.disconnect();
    };
  }, []);

  const onchange = () => {
    getData();
  };

  const demoinquiry = inquiryData.filter((item) => item.status === "Pending");
  const positiveres = inquiryData.filter((item) => item.status === "Positive");
  const negativeres = inquiryData.filter((item) => item.status === "Negative");

  const menuItems = [
    {
      name: "New Inquiry",
      key: "New Inquiry",
      component: <DemoInquiry inquiryData={demoinquiry} onchange={onchange} />,
    },
    {
      name: "Positive Feedback",
      key: "Positive Feedback",
      component: <PositiveFeedback inquiryData={positiveres} />,
    },
    {
      name: "Negative Feedback",
      key: "Negative Feedback",
      component: <NegativeFeedback inquiryData={negativeres} />,
    },
  ];

  return (
    <div>
      <nav className="bg-white text-black p-3 shadow-md">
        <div className="flex justify-between items-center">
          <ul className="flex space-x-3">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => setActiveContent(item.key)}
                  className={`px-4 py-2 border-b-2 ${
                    activeContent === item.key
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent"
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-5">
        {menuItems.map(
          (item) =>
            activeContent === item.key && (
              <div key={item.key}>{item.component}</div>
            )
        )}
      </div>
    </div>
  );
};

export default TopNavbar;
