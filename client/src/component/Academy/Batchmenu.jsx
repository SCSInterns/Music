import React, { useState } from "react";
import BatchManagement from "./BatchManagement";
import ParticularBatches from "./ParticularBatches";
import Timetable from "./TimeTable";

const TopNavbar = () => {
  const [activeContent, setActiveContent] = useState("Insert Batch Details");

  const menuItems = [
    {
      name: "Insert Batch Details",
      key: "Insert Batch Details",
      component: <BatchManagement />,
    },
    {
      name: "Add Specific Details",
      key: "Add Specific Details",
      component: <ParticularBatches />,
    },
    { name: " Time Table", key: "Time Table", component: <Timetable /> },
  ];

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
