import React, { useEffect, useState } from "react";
import Token from "../../Token/Token";
import { toast } from "react-toastify";
import Pricing from "./Pricing";
import NewRequest from "./NewRequest";
import ActiveRequest from "./ActiveRequest";
import CompletedRequest from "./CompletedRequest";
import ViewAdvertiseList from "./ViewAdvertiseList";
import DefaultBanners from "./DefaultBanners";
import { io } from "socket.io-client";

const TopNavbar = () => {
  const [activeContent, setActiveContent] = useState("Set Pricing");
  const [list, setlist] = useState([]);
  const [activeplans, setactiveplans] = useState([]);
  const [completedplans, setcompletedplans] = useState([]);
  const socket = React.useRef(null);
  const token = Token();
  const role = sessionStorage.getItem("role");

  const startSocket = () => {
    socket.current.on("NewApplicationAdv", (newEntry) => {
      fetchdata();
    });
  };

  useEffect(() => {
    socket.current = io("http://localhost:5000");
    startSocket();
    return () => {
      socket.current.off("NewApplicationAdv");
      socket.current.disconnect();
    };
  }, []);

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

  const newrequest = list.filter((item) => item.paymentstatus === "Pending");
  const activerequest = list.filter((item) => item.paymentstatus === "Paid");

  const compareDates = (date1, date2) => {
    const [day1, month1, year1] = date1.split("-").map(Number);
    const [day2, month2, year2] = date2.split("-").map(Number);

    const d1 = new Date(year1, month1 - 1, day1);
    const d2 = new Date(year2, month2 - 1, day2);

    if (d2 > d1) {
      return true;
    } else {
      return false;
    }
  };

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const todaydate = getCurrentDate();

  useEffect(() => {
    const active = [];
    const completed = [];
    const filtered = list.filter((item) => item.paymentstatus === "Paid");
    filtered.forEach((item) => {
      if (compareDates(todaydate, item.expirydate)) {
        active.push(item);
      } else {
        completed.push(item);
      }
    });
    setactiveplans(active);
    setcompletedplans(completed);
  }, [list]);

  const menuItems = [
    {
      name: "Create Advertisement",
      key: "Set Pricing",
      component: <Pricing />,
    },
    {
      name: "View Advertisements List",
      key: "View Advertisements List",
      component: <ViewAdvertiseList />,
    },
    {
      name: "Pending Request",
      key: "New Request",
      component: <NewRequest records={newrequest} onUpdate={fetchdata} />,
    },
    {
      name: "Active Advertisements",
      key: "Active Advertisements",
      component: <ActiveRequest records={activeplans} />,
    },
    {
      name: "Completed Advertisements",
      key: "Completed Advertisements",
      component: <CompletedRequest records={completedplans} />,
    },
    {
      name: "Marketing Banners",
      key: "Marketing Banners",
      component: <DefaultBanners records={completedplans} />,
    },
  ];

  return (
    <>
      <div>
        <nav className="bg-white text-black p-3 shadow-md">
          <div className="flex justify-between items-center w-full overflow-x-auto no-scrollbar">
            <ul className="flex space-x-3 ">
              {menuItems.map((item) => (
                <li key={item.key} className="inline-block">
                  <button
                    onClick={() => setActiveContent(item.key)}
                    className={`inline-flex px-4 py-2 border-b-2 whitespace-normal ${
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
