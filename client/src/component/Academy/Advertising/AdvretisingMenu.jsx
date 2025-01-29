import React, { useEffect, useState } from "react";
import Token from "../../Token/Token";
import { toast } from "react-toastify";
import Pricing from "./Pricing";
import ActivePlans from "./ActivePlans";
import CompletedPlan from "./CompletedPlan";

const TopNavbar = () => {
  const [activeContent, setActiveContent] = useState("Pricing");
  const [list, setlist] = useState([]);
  const [activeplans, setactiveplans] = useState([]);
  const [completedplans, setcompletedplans] = useState([]);
  const token = Token();
  const role = sessionStorage.getItem("role");
  const academyid = sessionStorage.getItem("academyid");

  const fetchdata = async () => {
    try {
      const url =
        "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/getacademyadvplans";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          academyid: academyid,
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

  const compareDates = (date1, date2) => {
    if (!date1 && !date2) return false;
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

  const onUpdate = () => {
    fetchdata();
  };

  useEffect(() => {
    const active = [];
    const completed = [];
    list.forEach((item) => {
      if (item.expirydate !== "Pending") {
        if (compareDates(todaydate, item.expirydate)) {
          active.push(item);
        } else {
          completed.push(item);
        }
      } else {
        active.push(item);
      }
    });

    setactiveplans(active);
    setcompletedplans(completed);
  }, [list]);

  const menuItems = [
    {
      name: "Pricing",
      key: "Pricing",
      component: (
        <Pricing
          onUpdate={() => {
            onUpdate();
          }}
        />
      ),
    },
    {
      name: "Active Plans",
      key: "Active Plans",
      component: (
        <ActivePlans
          records={activeplans}
          onUpdate={() => {
            onUpdate();
          }}
        />
      ),
    },
    {
      name: "Completed Plans",
      key: "Completed Plans",
      component: <CompletedPlan records={completedplans} />,
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
