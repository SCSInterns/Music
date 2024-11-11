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
import Paymnettable from "./Paymnettable";
import ProfileAbout from "./ProfileAbout";
import { Fab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import BatchProfile from "./BatchProfile";

function Profile() {
  const [sociallinks, setsociallinks] = useState("");
  const academyname = sessionStorage.getItem("Academy");

  const getsociallinks = async () => {
    const url = "http://localhost:5000/api/auth/getsociallinks";

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
  const navigate = useNavigate();
  const id = sessionStorage.getItem("Userid");

  const [togglepayment, settogglepayment] = useState(false);
  const [toggleabout, settoggleabout] = useState(true);
  const [toggleBatch, settoggleBatch] = useState(false);

  const [data, setData] = useState({});
  const [paymnetdata, setpaymnetdata] = useState({});
  const [batchdata, setbatchdata] = useState({});
  const [profilename, setprofilename] = useState("");

  function extractFirstLetter(fullName) {
    const firstName = fullName.split(" ")[0];
    return firstName.charAt(0).toUpperCase();
  }

  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const url = "http://localhost:5000/api/auth/fetchprofile";

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
        profileData.additionalFields.formdata?.Name
      );
      setprofilename(avatarimage);
      setData(profileData);
      setLoading(false);
    }
  };

  const paymentinfo = async (id, name, role, academyname) => {
    const url = "http://localhost:5000/api/auth/getinfoinstallment";

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
    const url = "http://localhost:5000/api/auth/getbatchdetail";

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

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (data && data._id) {
      paymentinfo(
        data._id,
        data.additionalFields?.formdata?.Name || "Unknown",
        "Admin",
        academyname
      );

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

  const handletoggleabout = () => {
    settoggleabout(true);
    settogglepayment(false);
    settoggleBatch(false);
  };

  const handlebatchtoggle = () => {
    settoggleBatch(true);
    settoggleabout(false);
    settogglepayment(false);
  };

  const handlepaymenttoggle = () => {
    settoggleabout(false);
    settogglepayment(true);
    settoggleBatch(false);
  };

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
              {data.additionalFields.formdata?.Name || "N/A"}
            </Typography>
            <Typography
              variant="h6"
              className="text-gray-500 mb-4 py-2"
              sx={{ fontFamily: "ubuntu" }}
            >
              {data.role || "User"}
            </Typography>
          </div>

          <div
            style={{
              backgroundColor: "#f9fafb",
              padding: "10px",
              display: "flex",
              marginTop: "20px",
            }}
          >
            <Button
              style={{
                backgroundColor: toggleabout ? "#9C27B0" : "transparent",
                color: toggleabout ? "#fff" : "#000",
                border: "1px solid #ccc",
              }}
              onClick={() => handletoggleabout()}
            >
              Account Info
            </Button>
            <Button
              style={{
                marginLeft: "10px",
                backgroundColor: togglepayment ? "#9C27B0" : "transparent",
                color: togglepayment ? "#fff" : "#000",
                border: "1px solid #ccc",
              }}
              onClick={() => handlepaymenttoggle()}
            >
              Payment Info
            </Button>

            <Button
              style={{
                marginLeft: "10px",
                backgroundColor: toggleBatch ? "#9C27B0" : "transparent",
                color: toggleBatch ? "#fff" : "#000",
                border: "1px solid #ccc",
              }}
              onClick={() => handlebatchtoggle()}
            >
              Batch Info
            </Button>
          </div>

          {toggleabout && <ProfileAbout data={data} />}

          {togglepayment && <Paymnettable info={paymnetdata} />}

          {toggleBatch && <BatchProfile details={batchdata} />}
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
