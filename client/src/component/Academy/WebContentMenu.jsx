import React, { useState } from "react";
import MediaMenu from "../Media/MediaMenu";
import Events from "../Academy Features/Events";
import About from "../Academy Features/Aboutus";
import Instrument from "../Academy Features/Instruments";
import SocialLinks from "../Academy Features/SocialLinks";

const TopNavbar = () => {
  const [activeContent, setActiveContent] = useState("Media");

  const menuItems = [
    { name: "Media", key: "Media", component: <MediaMenu /> },
    { name: "Event", key: "Event", component: <Events /> },
    { name: "About", key: "About", component: <About /> },
    { name: "Instrument", key: "Instrument", component: <Instrument /> },
    { name: "Social Links", key: "Social", component: <SocialLinks /> },
  ];

  return (
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
  );
};

export default TopNavbar;
