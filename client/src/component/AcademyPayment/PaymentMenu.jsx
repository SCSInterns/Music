import React, { useState } from "react";
import QrDetails from "./QrDetails";
import Razorpay from "./Razorpay";
import RazorPayGuide from "./RazorPayGuide";
import GmailCred from "./GmailCred";

const TopNavbar = () => {
  const [activeContent, setActiveContent] = useState("Insert Payment Qr");

  const menuItems = [
    {
      name: "Insert Payment Qr",
      key: "Insert Payment Qr",
      component: <QrDetails />,
    },
    {
      name: "Insert Razor Pay Details",
      key: "Insert Razor Pay Details",
      component: <Razorpay />,
    },
    {
      name: "Razor Pay Guide",
      key: "Razor Pay Guide",
      component: <RazorPayGuide />,
    },
    {
      name: "Insert Google App Details",
      key: "Insert Google App Details",
      component: <GmailCred />,
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
