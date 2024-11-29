import React, { useState } from "react";
import PaymentBox from "./PaymentBox";
import ManualPayment from "./ManualPayment";

const TopNavbar = ({ data }) => {
  const [activeContent, setActiveContent] = useState("Online Payment");

  const menuItems = [
    {
      name: "Online Payment",
      key: "Online Payment",
      component: <PaymentBox data={data} />,
    },
    {
      name: "Manual Payment",
      key: "Manual Payment",
      component: <ManualPayment data={data} />,
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
