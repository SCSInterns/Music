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

  const token = Token();
  const role = sessionStorage.getItem("role");

  const fetchdata = async () => {
    try {
      const url = "http://localhost:5000/api/auth/getalladvertise";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          role: role,
        }),
      });
      const data = await response.json();
      setlist(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  console.log(list);
  const newrequest = list.filter((item) => item.paymentstatus === "Pending");
  console.log(newrequest);
  const activerequest = list.filter((item) => item.paymentstatus === "Paid");

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
      component: <NewRequest records={newrequest} onChange={fetchdata()} />,
    },
    {
      name: "Active Advertisements",
      key: "Active Advertisements",
      component: <ActiveRequest records={activerequest} />,
    },
    {
      name: "Completed Advertisements",
      key: "Completed Advertisements",
      component: <CompletedRequest />,
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
