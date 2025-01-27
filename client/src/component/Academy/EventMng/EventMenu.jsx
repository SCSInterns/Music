import React, { useState } from "react";
import CreateEvent from "../EventMng/Create Events/MainPage";
import EventList from "../EventMng/Event List/MainPage";
import ParticipantsList from "../EventMng/Event Participants/MainPage";
import ViewersList from "../EventMng/Event Viewers/MainPage";

const TopNavbar = () => {
  const [activeContent, setActiveContent] = useState("Create Event");

  const menuItems = [
    {
      name: "Create Event",
      key: "Create Event",
      component: <CreateEvent />,
    },
    {
      name: "Events List",
      key: "Events List ",
      component: <EventList />,
    },
    {
      name: "Event Participants",
      key: "Event Participants",
      component: <ParticipantsList />,
    },
    {
      name: "Event Viewers",
      key: "Event Viewers",
      component: <ViewersList />,
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
        <div className="p-5 my-5">
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
