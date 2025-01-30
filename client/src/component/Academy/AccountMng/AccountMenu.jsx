import React, { useEffect, useState } from "react";
import Token from "../../Token/Token";
import { toast } from "react-toastify";
import PaymentDetails from "./PaymentDetails";
import MonthlyPay from "./MonthlyPay";
import PaymentHistory from "./PaymentHistory";
import PaymentRequest from "../PaymentRequest";

const TopNavbar = () => {
  const [activeContent, setActiveContent] = useState("Payment Details");
  const [list, setlist] = useState([]);

  const menuItems = [
    {
      name: "Payment Details",
      key: "Payment Details",
      component: <PaymentDetails />,
    },
    {
      name: "Monthly Payment",
      key: "Monthly Payment",
      component: <MonthlyPay />,
    },
    {
      name: "Payment History",
      key: "Payment History",
      component: <PaymentHistory list={list} />,
    },
    {
      name: "Payment Review (Qr)",
      key: "Payment Review(Qr)",
      component: <PaymentRequest />,
    },
  ];

  const token = Token();
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const handlebatchlist = async () => {
    const url =
      "https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/getbatchstudents";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const filterdata = data.filter((item) => item.batchname !== "");
      const finalfilter = filterdata.filter((item) => item.status !== "Reject");
      setlist(finalfilter);
    } else {
      toast.error("Error fetching batch list");
    }
  };

  useEffect(() => {
    handlebatchlist();
  }, []);

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
