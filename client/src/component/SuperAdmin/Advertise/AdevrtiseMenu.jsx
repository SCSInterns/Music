import React, { useEffect, useState } from "react";
import Token from "../../Token/Token";
import { toast } from "react-toastify";
import Pricing from "./Pricing";
import NewRequest from "./NewRequest";
import ActiveRequest from "./ActiveRequest";
import CompletedRequest from "./CompletedRequest";
import ViewAdvertiseList from "./ViewAdvertiseList";

const TopNavbar = () => {
  const [activeContent, setActiveContent] = useState("Set Pricing");
  const [list, setlist] = useState([]);

  const menuItems = [
    {
      name: "Set Pricing",
      key: "Set Pricing",
      component: <Pricing />,
    },
    {
      name: "View Advertisements List",
      key: "View Advertisements List",
      component: <ViewAdvertiseList />,
    },
    {
      name: "New Request",
      key: "New Request",
      component: <NewRequest />,
    },
    {
      name: "Active Advertisements",
      key: "Active Advertisements",
      component: <ActiveRequest />,
    },
    {
      name: "Completed Advertisements",
      key: "Completed Advertisements",
      component: <CompletedRequest />,
    },
  ];

  const token = Token();
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  return (
    <>
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
    </>
  );
};

export default TopNavbar;
