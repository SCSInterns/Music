import React, { useEffect, useState } from "react";
import NewFreetrial from "./NewFreetrial";
import ActiveFreeTrial from "./ActiveFreeTrial";
import Token from "../Token/Token";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import CompletedFreeTrial from "./CompletedFreeTrial";

const TopNavbar = () => {
  const [activeContent, setActiveContent] = useState("New Request");
  const token = Token();
  const role = sessionStorage.getItem("role");
  const socket = React.useRef(null);
  const [data, setdata] = useState([]);

  const fetchfreelist = async () => {
    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/fetchfreelist";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setdata(data);
    } else {
      toast.error("Error fetching free trial list");
    }
  };

  useEffect(() => {
    fetchfreelist();
  }, []);

  const onstatuschange = () => {
    fetchfreelist();
  };

  useEffect(() => {
    socket.current = io("http://localhost:5000");
    socket.current.on("newFreeTrialReq", (newEntry) => {
      setdata((prevEntries) => [newEntry, ...prevEntries]);
    });

    return () => {
      socket.current.off("newFreeTrialReq");
      socket.current.disconnect();
    };
  }, []);

  const newRequests = data.filter(
    (item) => item.accessDetails.academy_access === " To be updated by admin "
  );
  const activeRequest = data.filter(
    (item) => item.accessDetails.academy_access === "Accept"
  );

  const menuItems = [
    {
      name: "New Request",
      key: "New Request",
      component: (
        <NewFreetrial
          newRequests={newRequests}
          onstatuschange={onstatuschange}
        />
      ),
    },
    {
      name: "Active Free Trial",
      key: "Active Free Trial",
      component: <ActiveFreeTrial activeRequest={activeRequest} />,
    },
    {
      name: "Completed Free Trial",
      key: "Completed Free Trial",
      component: <CompletedFreeTrial activeRequest={activeRequest} />,
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
