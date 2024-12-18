import React, { useState } from "react";
import PaymentBox from "./PaymentBox";
import AcademyStatus from "./AcademyStatus";
import PersonalInfo from "./PersonalInfo";
import PaymentSheet from "./PaymentSheet";

const TopNavbar = ({
  admin,
  handlestatus,
  details,
  renderTableRows,
  credsend,
  inputChange,
  handlesharecred,
  info,
}) => {
  const [activeContent, setActiveContent] = useState("Add Payment");

  const menuItems = [
    {
      name: "Add Payment",
      key: "Add Payment",
      component: <PaymentBox admin={admin} />,
    },
    {
      name: "Handle Status",
      key: "Handle Status",
      component: (
        <AcademyStatus
          admin={admin}
          handlestatus={handlestatus}
          credsend={credsend}
          inputChange={inputChange}
          handlesharecred={handlesharecred}
        />
      ),
    },
    {
      name: "Personal Info",
      key: "Personal Info",
      component: (
        <PersonalInfo details={details} renderTableRows={renderTableRows} />
      ),
    },
    {
      name: "Payment Info",
      key: "Payment Info",
      component: <PaymentSheet info={info} />,
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
                        ? "border-blue-800 text-blue-800"
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
