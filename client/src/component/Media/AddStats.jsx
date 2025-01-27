import React, { useState } from "react";
import { FaBusinessTime } from "react-icons/fa6";
import { SiMicrosoftteams } from "react-icons/si";
import { FaUserPlus } from "react-icons/fa";
import { PiCertificateBold } from "react-icons/pi";
import { Box, Button, Typography, TextField } from "@mui/material";
import Token from "../Token/Token";
import { toast } from "react-toastify";

function AddStats() {
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const [stats, setStats] = useState({
    students: "",
    certificate: "",
    mentors: "",
    exp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStats({
      ...stats,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (
      stats.students <= 0 ||
      stats.certificate <= 0 ||
      stats.exp <= 0 ||
      stats.mentors <= 0
    ) {
      return toast.error("Values can't be negative or zero");
    }

    const data = {
      academyname: academyname,
      role: role,
      students_enroll: stats.students,
      instrument_cousre_offered: stats.certificate,
      Certified_Instructors: stats.mentors,
      Years_of_Operation: stats.exp,
    };

    const url =
      "https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/addstats";
    const token = Token();
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Academy Stats saved successfully!");
        setStats({
          students: "",
          certificate: "",
          mentors: "",
          exp: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.msg}`);
      }
    } catch (error) {
      console.error("Error while saving academy stats:", error);
      toast.error(
        "An error occurred while saving academy stats . Please try again later."
      );
    }
  };

  return (
    <>
      <div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "100%",
            maxWidth: 500,
            margin: "auto",
            marginTop: "30px",
          }}
        >
          <Typography variant="h6" textAlign="center">
            Enter Your Music Academy Stats Here
          </Typography>

          {/* students enroll */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FaUserPlus
              fontSize="large"
              size={30}
              sx={{ color: "#0d1b2a", marginRight: "30px" }}
            />
            <TextField
              label="Students enroll"
              name="students"
              value={stats.students}
              type="number"
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0 }}
              sx={{ marginLeft: "20px" }}
              placeholder="Enter total no of students your academy have trained "
            />
          </Box>

          {/*   instrument_course_offered */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PiCertificateBold
              fontSize="large"
              size={30}
              sx={{ color: "#0d1b2a", marginRight: "20px" }}
            />
            <TextField
              label="Instrument Course Offered"
              name="certificate"
              value={stats.certificate}
              onChange={handleChange}
              type="number"
              fullWidth
              sx={{ marginLeft: "20px" }}
              required
              inputProps={{ min: 0 }}
              placeholder="Enter total no of instruments courses offered  "
            />
          </Box>

          {/* Certified_Instructors */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SiMicrosoftteams
              fontSize="large"
              size={30}
              sx={{ color: "#0d1b2a", marginRight: "20px" }}
            />
            <TextField
              label="Certified Instructors"
              name="mentors"
              type="number"
              value={stats.mentors}
              onChange={handleChange}
              fullWidth
              sx={{ marginLeft: "20px" }}
              required
              inputProps={{ min: 0 }}
              placeholder="Enter total no of trainers "
            />
          </Box>

          {/* Years_of_Operation */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FaBusinessTime
              fontSize="large"
              size={30}
              sx={{ color: "#0d1b2a", marginRight: "20px" }}
            />
            <TextField
              label="Years of Operation"
              name="exp"
              type="number"
              value={stats.exp}
              required
              inputProps={{ min: 0 }}
              sx={{ marginLeft: "20px" }}
              onChange={handleChange}
              fullWidth
              placeholder="Enter no of years of experience "
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ width: "200px", margin: "auto", backgroundColor: "#0d1b2a" }}
          >
            Save Stats
          </Button>
        </Box>
      </div>
    </>
  );
}

export default AddStats;
