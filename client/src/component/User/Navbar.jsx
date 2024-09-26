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

const navigation = [
  { name: "Aboutus", href: "/", title: "Aboutus", current: false },
  { name: "Gallery", href: "/", title: "Gallery", current: false },
  { name: "Videos", href: "/", title: "Videos", current: false },
  { name: "Events", href: "/", title: "Events", current: false },
  { name: "Instruments", href: "/", title: "Instruments", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const academyname = sessionStorage.getItem("Academy");

export default function Example() {
  const [currentPath, setCurrentPath] = useState(null);
  const [logo, setlogo] = useState("");

  const getlogo = async () => {
    const url = "http://localhost:5000/api/auth/getlogo";

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
      setlogo(data.link);
    }
  };

  useEffect(() => {
    getlogo();
  }, [academyname]);

  useEffect(() => {
    const handlePathChange = () => {
      const path = window.location.pathname;
      setCurrentPath(path);

      const currentPage = navigation.find((item) => item.href === path);
      if (currentPage) {
        document.title = `Kalam : ${currentPage.title}`;
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

  const username = sessionStorage.getItem("username");

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
            style={{
              background: `linear-gradient(to bottom, #374151, #111827)`,
              color: "white",
              position: "",
            }}
          >
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
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
                    borderRadius: "8px", // Optional: add a small border radius
                    paddingBottom: "15px", // Adds space around the logo
                  }}
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt="Academy Logo"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        mixBlendMode: "screen"
                      }}
                    />
                  ) : null}
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4 items-center">
                    {navigation.map((item) => (
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
                    ))}
                  </div>
                </div>
              </div>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <AccountCircleOutlinedIcon fontSize="large" />
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
                        <a
                          onClick={handleSignOut}
                          href="/login"
                          className={classNames(
                            focus ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          {!username == " " ? ` Sign Out ` : ` Login`}
                        </a>
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
              style={{
                background: "linear-gradient(to bottom, #374151, #111827) ",
              }}
            >
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    currentPath === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
