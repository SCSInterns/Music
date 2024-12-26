import React, { useEffect, useState } from "react";
import Token from "../Token/Token";

function NewRequest() {
  const [emailinfo, setEmailinfo] = useState({ email: "" });
  const username = sessionStorage.getItem("name");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const token = Token();
        console.log("Fetching superadmin details with token:", token);
        const url = `https://music-academy-e32v.onrender.com/api/superadmin/superadmindetails`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: username }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Superadmin details fetched:", data);
          if (data.length > 0) {
            setEmailinfo({ email: data[0].email });
          } else {
            console.log("No superadmin details found");
          }
        } else {
          console.log("Failed to fetch superadmin details:", response.status);
        }
      } catch (error) {
        console.error("Error fetching superadmin details:", error);
      }
    };

    if (username) {
      fetchInfo();
    } else {
      console.log("No username found in sessionStorage");
    }
  }, [username]);

  let superadminemail = emailinfo.email;

  return superadminemail;
}

export default NewRequest;
