import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Token from "../Token/Token";
import Cover from "../../static/Images/Profilecover.jpeg";
import { Fab } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ProfileMenu from "./ProfileMenu";

function Profile() {
  const [sociallinks, setsociallinks] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  const academyname = sessionStorage.getItem("Academy");

  const getsociallinks = async () => {
    const url =
      "https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/getsociallinks";

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

  console.log(sociallinks);

  useEffect(() => {
    getsociallinks();
  }, [academyname]);

  const token = Token();
  const id = sessionStorage.getItem("Userid");

  const [data, setData] = useState({});
  const [paymnetdata, setpaymnetdata] = useState({});
  const [batchdata, setbatchdata] = useState({});
  const [profilename, setprofilename] = useState("");

  function extractFirstLetter(fullName) {
    const firstName = fullName.split(" ")[0] || "";
    return firstName.charAt(0).toUpperCase();
  }

  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const url =
      "https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/fetchprofile";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentid: id,
        academyname: academyname,
      }),
    });

    if (response.ok) {
      const profileData = await response.json();

      const avatarimage = await extractFirstLetter(
        profileData.additionalFields?.Name
      );
      setprofilename(avatarimage);
      setData(profileData);
      setLoading(false);
    }
  };

  const paymentinfo = async (id, name, role, academyname) => {
    const url =
      "https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/getinfoinstallment";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentid: id,
        username: name,
        role: role,
        academyname: academyname,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setpaymnetdata(data);
    }
  };

  const batchdetails = async (id) => {
    console.log("Student Id :", id);
    const url =
      "https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/getbatchdetail";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentid: id,
        academyname: academyname,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setbatchdata(data);
    }
  };

  const fetchqr = async (studentId) => {
    try {
      const url =
        "https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/fetchqr";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyname: academyname,
          studentid: studentId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodeData(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (data && data._id) {
      paymentinfo(
        data._id,
        data.additionalFields?.Name || "Unknown",
        "Admin",
        academyname
      );
      fetchqr(data._id);
      batchdetails(data._id);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Box className="min-h-screen bg-gray-100 py-10 px-5">
        <Card
          className="max-w-5xl mx-auto shadow-lg"
          style={{ border: "2px solid #0c4b65" }}
        >
          <Box className="relative">
            {/* Cover Image */}
            <img
              src={Cover}
              alt="Profile cover"
              className="w-full h-72 object-cover"
            />
            {/* Profile Image */}

            <Avatar
              alt="Profile"
              className="absolute -bottom-4 left-8 border-4 border-white"
              sx={{
                width: 150,
                height: 150,
                bgcolor: "#020617",
                fontSize: "45px",
                fontFamily: "ubuntu",
                marginTop: "-70px",
              }}
            >
              {profilename}
            </Avatar>
          </Box>

          <div style={{ marginTop: "-70px" }}>
            <Typography
              variant="h4"
              className="font-bold mb-2"
              sx={{ fontFamily: "ubuntu" }}
            >
              {data.additionalFields?.Name || "N/A"}
            </Typography>
            <Typography
              variant="h6"
              className="text-gray-500 mb-4 py-2"
              sx={{ fontFamily: "ubuntu" }}
            >
              {data.role || "User"}
            </Typography>
          </div>

          <ProfileMenu
            data={data}
            info={paymnetdata}
            details={batchdata}
            qrcode={qrCodeData}
          />
        </Card>
      </Box>

      <a href={`${sociallinks.whatsapp}`} target="blank">
        <Fab
          color="primary"
          size="small"
          aria-label="support"
          sx={{
            position: "fixed",
            bottom: 20,
            padding: "5px",
            right: 20,
            backgroundColor: "#9C27B0",
            "&:hover": {
              backgroundColor: "#7B1FA2",
            },
          }}
        >
          <SupportAgentIcon />
        </Fab>
      </a>

      <Footer />
    </>
  );
}

export default Profile;
