import React, { useState, useEffect } from "react";
import Invoice from "./Invoice";
import RenewalPayment from "./RenewalPayment";
import Token from "../Token/Token";

const TopNavbar = ({ academyid, info }) => {
  const [activeContent, setActiveContent] = useState("Subscription Invoice");

  const [admin, setAdmin] = useState([]);

  const fetchadmindetailsbyid = async (id) => {
    try {
      id = "675c08a0f856f8bc5bdf2c4f";
      const url = `http://localhost:5000/api/superadmin/detailsofadminbyid/${id}`;
      const token = Token();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdmin(data);
      } else {
        console.error("Failed to fetch admin details");
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  useEffect(() => {
    fetchadmindetailsbyid(academyid);
  }, [academyid]);

  const menuItems = [
    {
      name: "Subscription Invoice",
      key: "Subscription Invoice",
      component: <Invoice info={info} id={academyid} admin={admin} />,
    },
    {
      name: "Renew Subscription",
      key: "Renew Subscription",
      component: <RenewalPayment id={academyid} admin={admin} />,
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
