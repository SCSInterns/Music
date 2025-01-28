import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { IoLogoFacebook } from "react-icons/io";
import { FaInstagram } from "react-icons/fa6";

export default function Footer() {
  const academyname = sessionStorage.getItem("Academy");
  const [logo, setlogo] = useState("");
  const [details, setdetails] = useState("");
  const [sociallinks, setsociallinks] = useState("");
  const [fulladdress, setfulladdress] = useState("");

  function constructAddress(response) {
    const { academy_address, academy_city, academy_state, academy_pincode } =
      response;

    const fullAddress = `${academy_address}, ${academy_city}, ${academy_state} - ${academy_pincode}`;
    setfulladdress(fullAddress);
    return;
  }

  const getlogo = async () => {
    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/getlogo";

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

  const getacademydetails = async () => {
    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/getacademydetails";

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
      setdetails(data[0]);
      constructAddress(data[0]);
    }
  };

  const getsociallinks = async () => {
    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/getsociallinks";

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
      setsociallinks(data[0]);
    }
  };

  useEffect(() => {
    if (academyname) {
      getlogo();
      getsociallinks();
      getacademydetails();
    }
  }, [academyname]);

  return (
    <div
      className="px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8"
      style={{
        backgroundColor: "#020617",
        color: "white",
        fontFamily: "ubuntu",
      }}
    >
      <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2" style={{ marginTop: "-40px" }}>
          <a
            href="/"
            aria-label="Go home"
            title="Company"
            className="inline-flex items-center"
          ></a>
          <div
            className="flex flex-shrink-0 items-center"
            style={{
              marginLeft: window.innerWidth < 1024 ? "30px" : "0",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                padding: "2px",
                margin: "2px",
                color: "yellow",
              }}
            >
              {logo ? (
                <img
                  src={logo}
                  alt="Academy Logo"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "contain",
                    mixBlendMode: "screen",
                  }}
                />
              ) : null}
            </div>
          </div>
          <div className="mt-2 lg:max-w-sm">
            <p
              className="text-sm text-gray-800"
              style={{ color: "white", marginLeft: "-250px" }}
            >
              {academyname} Music Academy
            </p>

            <p style={{ textAlign: "justify", fontSize: "15px" }}>
              Join us at {academyname} to unlock your musical potential.
              Offering expert training in a wide range of instruments and vocal
              techniques. Contact us today to begin your musical journey !
            </p>
          </div>
        </div>
        <div className="space-y-2 text-sm" style={{ marginLeft: "-50px" }}>
          <p
            className="text-base font-bold tracking-wide text-gray-900"
            style={{ color: "white", textAlign: "left" }}
          >
            Contacts
          </p>
          <div className="flex">
            <p className="mr-1 ">Phone:</p>
            <a
              href={`tel:${details.contactno}`}
              aria-label="Our phone"
              title="Our phone"
              className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-deep-purple-800"
            >
              {details.contactno}
            </a>
          </div>
          <div className="flex">
            <p className="mr-1 ">Email:</p>
            <a
              href={`mailto:${sociallinks.mail}`}
              aria-label="Our email"
              title="Our email"
              className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-deep-purple-800"
            >
              {sociallinks.mail}
            </a>
          </div>
          <div className="flex">
            <p className="mr-1">Address:</p>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Our address"
              title="Our address"
              className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-deep-purple-800"
            >
              {fulladdress}
            </a>
          </div>
        </div>
        <div>
          <span className="text-base font-bold tracking-wide ">Social</span>
          <div
            className="flex items-center mt-1 space-x-3"
            style={{
              marginTop: "10px",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <a
              href={`${sociallinks.instagram}`}
              className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400"
            >
              <FaInstagram size="25" />
            </a>
            <a
              href={`${sociallinks.whatsapp}`}
              className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400"
            >
              <BsWhatsapp size="25" />
            </a>
            <a
              href={`mailto:${sociallinks.mail}`}
              className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400"
            >
              <IoMailOutline size="25" />
            </a>

            <a
              href={`${sociallinks.youtube}`}
              className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400"
            >
              <FaYoutube size="25" />
            </a>

            <a
              href={`${sociallinks.facebook}`}
              className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400"
            >
              <IoLogoFacebook size="25" />
            </a>
          </div>
          <p className="mt-4 text-sm text-justify">
            Follow us on social media to stay updated with our latest courses,
            events, and performances. Let the music inspire your journey !
          </p>
        </div>
      </div>
      <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row">
        <p className="text-sm ">
          Copyright © {academyname} 2024. All Rights Reserved.
        </p>
        <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
          <li>
            <a
              href="/"
              className="text-sm  transition-colors duration-300 hover:text-deep-purple-accent-400"
            >
              About us
            </a>
          </li>
          <li>
            <a
              href="/"
              className="text-sm  transition-colors duration-300 hover:text-deep-purple-accent-400"
            >
              Gallery
            </a>
          </li>
          <li>
            <a
              href="/"
              className="text-sm  transition-colors duration-300 hover:text-deep-purple-accent-400"
            >
              Events
            </a>
          </li>
          <li>
            <a
              href="/"
              className="text-sm  transition-colors duration-300 hover:text-deep-purple-accent-400"
            >
              Instruments
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
