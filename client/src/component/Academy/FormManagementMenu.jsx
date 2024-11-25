import React, { useState } from "react";
import BatchManagement from "./BatchManagement";
import RegForm from "./AcademyRegistration";
import DynamicForm from "./DynamicForm";

const TopNavbar = () => {
  const [activeContent, setActiveContent] = useState(
    "Create Registartion Form"
  );

  const menuItems = [
    {
      name: "Create Registartion Form",
      key: "Create Registartion Form",
      component: <DynamicForm />,
    },
    {
      name: "View Registartion Form",
      key: "View Registartion Form",
      component: <RegForm />,
    },
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
