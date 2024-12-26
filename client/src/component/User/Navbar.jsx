import { Fragment, useEffect, useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Typography } from "@mui/material";

const Example = () => {
  const storedAcademyName = sessionStorage.getItem("Academy");
  const [academyname, setAcademyName] = useState(storedAcademyName || "");
  const [currentPath, setCurrentPath] = useState(null);
  const [logo, setLogo] = useState("");
  const role = sessionStorage.getItem("role");
  const username = sessionStorage.getItem("username");

  const navigation = [
    {
      name: "About Us",
      href: "about",
      title: "About Us",
    },
    {
      name: "Gallery",
      href: `/${academyname}/Gallery`,
      title: "Gallery",
    },
    {
      name: "Events",
      href: `/${academyname}/event`,
      title: "Event",
    },
    {
      name: "Instruments",
      href: "instrument",
      title: "Instruments",
    },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getLogo = async () => {
    const url = "https://music-academy-e32v.onrender.com/api/auth/getlogo";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setLogo(data.link);
    }
  };

  useEffect(() => {
    if (academyname) {
      getLogo();
    }
  }, [academyname]);

  useEffect(() => {
    const handlePathChange = () => {
      const path = window.location.pathname;
      setCurrentPath(path);

      const currentPage = navigation.find((item) => item.href === path);
      if (currentPage) {
        document.title = `Music Academy  : ${currentPage.title}`;
      }

      const favicon = document.getElementById("favicon");
      if (favicon) {
        favicon.href = `/favicon-${currentPage.title.toLowerCase()}.ico`;
      }
    };

    handlePathChange();
    window.addEventListener("popstate", handlePathChange);
    return () => {
      window.removeEventListener("popstate", handlePathChange);
    };
  }, []);

  const handleSignOut = () => {
    sessionStorage.clear();
  };

  return (
    <Disclosure
      as="nav"
      className="bg-gray-800"
      style={{ backgroundColor: "#003135" }}
    >
      {({ open }) => (
        <>
          <div
            className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 navbarstyle"
            style={{ background: `#020617`, color: "white" }}
          >
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-center sm:justify-start">
                <div
                  className="flex flex-shrink-0 items-center justify-center"
                  style={{
                    marginLeft: window.innerWidth < 1024 ? "30px" : "0",
                    borderRadius: "8px",
                    paddingBottom: "15px",
                  }}
                >
                  <a href={`/${academyname}`}>
                    {logo && (
                      <img
                        src={logo}
                        alt="Academy Logo"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "contain",
                          mixBlendMode: "screen",
                        }}
                      />
                    )}
                  </a>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4 items-center">
                    {navigation.map((item) =>
                      item.name === "Events" || item.name === "Gallery" ? (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            currentPath === item.href
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <button
                          key={item.name}
                          onClick={() => {
                            if (
                              currentPath.includes("event") ||
                              currentPath.includes("registrationform") ||
                              currentPath.includes("Gallery")
                            ) {
                              window.location.href = `/${academyname}`;
                            } else {
                              scrollToSection(item.href);
                            }
                          }}
                          className={classNames(
                            currentPath === item.href
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                        >
                          {item.name}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Profile dropdown */}
              <Menu
                as="div"
                className="relative ml-3"
                style={{ position: "relative", zIndex: "20" }}
              >
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    {role ? (
                      <AccountCircleOutlinedIcon fontSize="large" />
                    ) : (
                      <button
                        className="shadow-lg flex gap-2 items-center bg-white p-2 hover:shadow-xl duration-300 hover:border-2 border-gray-400 group delay-200 rounded-md focus:outline-none"
                        style={{ color: "black", padding: "10px" }}
                      >
                        Login / Signup
                      </button>
                    )}
                  </MenuButton>
                </div>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <MenuItem>
                      {({ focus }) => (
                        <>
                          <a
                            // onClick={handleSignOut}
                            href={`${academyname}/login`}
                            className={classNames(
                              focus ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {username ? `Sign Out` : `Login`}
                          </a>
                          {!username && (
                            <a
                              href={`${academyname}/registrationform`}
                              className={classNames(
                                focus ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Signup
                            </a>
                          )}
                        </>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div
              className="space-y-1 px-2 pb-3 pt-2"
              style={{ background: "#020617" }}
            >
              {navigation.map((item) =>
                item.name === "Events" || item.name === "Gallery" ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      currentPath === item.href
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </a>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (
                        currentPath.includes("event") ||
                        currentPath.includes("registrationform") ||
                        currentPath.includes("Gallery")
                      ) {
                        window.location.href = `/${academyname}`;
                      } else {
                        scrollToSection(item.href);
                      }
                    }}
                    className={classNames(
                      currentPath === item.href
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </button>
                )
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Example;
