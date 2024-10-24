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

function Profile() {
  const token = Token();
  const academyname = sessionStorage.getItem("Academy");
  const id = sessionStorage.getItem("Userid");

  const [data, setData] = useState({});
  const [paymnetdata, setpaymnetdata] = useState({});

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

  console.log(data._id);
  console.log(paymnetdata);

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

  useEffect(() => {
    fetchProfile();
  }, []);

  console.log(data._id);

  useEffect(() => {
    if (data && data._id) {
      paymentinfo(
        data._id,
        data.additionalFields?.formdata?.Name || "Unknown",
        "Admin",
        academyname
      );
    }
  }, [data]);

  console.log("paymnet info : ", paymnetdata);

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
          <CardContent className="text-center">
            <div style={{ marginTop: "-40px" }}>
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

            {/* Profile Info Grid */}
            <Grid
              container
              spacing={4}
              className="mt-8"
              sx={{ marginTop: "50px" }}
            >
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  className="font-semibold"
                  sx={{ fontFamily: "ubuntu" }}
                >
                  Email:
                </Typography>
                <Typography variant="body1" className="mb-4">
                  {data.additionalFields.formdata?.Email || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  className="font-semibold"
                  sx={{ fontFamily: "ubuntu" }}
                >
                  Mobile No:
                </Typography>
                <Typography variant="body1" className="mb-4">
                  {data.additionalFields.formdata?.MobileNo || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  className="font-semibold"
                  sx={{ fontFamily: "ubuntu" }}
                >
                  Academy Name:
                </Typography>
                <Typography variant="body1" className="mb-4">
                  {data.academy_name || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  className="font-semibold"
                  sx={{ fontFamily: "ubuntu" }}
                >
                  Course:
                </Typography>
                <Typography variant="body1" className="mb-4">
                  {data.additionalFields.formdata?.Courses || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  className="font-semibold"
                  sx={{ fontFamily: "ubuntu" }}
                >
                  Fees:
                </Typography>
                <Typography variant="body1" className="mb-4">
                  {data.additionalFields?.fees || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  className="font-semibold"
                  sx={{ fontFamily: "ubuntu" }}
                >
                  Installment Date:
                </Typography>
                <Typography variant="body1" className="mb-4">
                  {data.installementDate || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  className="font-semibold"
                  sx={{ fontFamily: "ubuntu" }}
                >
                  Gender:
                </Typography>
                <Typography variant="body1" className="mb-4">
                  {data.additionalFields.formdata?.Gender || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  className="font-semibold"
                  sx={{ fontFamily: "ubuntu" }}
                >
                  Status:
                </Typography>
                <Typography variant="body1" className="mb-4">
                  {data.status || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </>
  );
}

export default Profile;
