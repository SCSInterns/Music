import React, { useState } from "react";
import ApplicantsTable from "./AppliacantsTable";
import NewAppliantsTable from "./NewApplicantsTable";

const TopNavbar = ({ users }) => {
  const newRequests = users.filter((item) => item.status === "To be updated");
  const acceptedRequests = users.filter((item) => item.status === "Accept");
  const rejectedRequests = users.filter((item) => item.status === "Reject");

  console.log(" newRequests ", newRequests);
  console.log(" acceptedRequests ", acceptedRequests);
  console.log(" rejectedRequests ", rejectedRequests);

  const [activeContent, setActiveContent] = useState("Accepted Applicants");

  const menuItems = [
    {
      name: "Accepted Applicants",
      key: "Accepted Applicants",
      component: <NewAppliantsTable users={acceptedRequests} />,
    },
    {
      name: "Rejected Applicants",
      key: "Rejected Applicants",
      component: <NewAppliantsTable users={rejectedRequests} />,
    },
    {
      name: "New Request",
      key: "New Request",
      component: <NewAppliantsTable users={newRequests} />,
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
