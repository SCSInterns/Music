import React, { useState } from "react";
import Payment from "./Payment";
import ProfileAbout from "./ProfileAbout";
import Paymnettable from "./Paymnettable";
import BatchProfile from "./BatchProfile";
import QRCodeComponent from "./Qrcode";

const TopNavbar = ({ data, info, details, qrcode }) => {
  const [activeContent, setActiveContent] = useState("Account Info");

  const menuItems = [
    {
      name: "Account Info",
      key: "Account Info",
      component: <ProfileAbout data={data} />,
    },
    {
      name: "Payment Info",
      key: "Payment Info",
      component: <Paymnettable info={info} />,
    },
    {
      name: "Batch Info",
      key: "Batch Info",
      component: <BatchProfile details={details} />,
    },
    {
      name: "Attendance Qr",
      key: "Attendance Qr",
      component: <QRCodeComponent qrcode={qrcode} />,
    },
    { name: "Pay Fees", key: "Pay Fees", component: <Payment data={data} /> },
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
                        ? "border-fuchsia-800 text-fuchsia-800"
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
