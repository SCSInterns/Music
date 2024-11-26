import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Typography, Button } from "@mui/material";
import { useState } from "react";
import Token from "../Token/Token";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import MediaMenu from "./MediaMenu";

export default function Addvideo() {
  const [videolink, setvideolink] = useState("");
  const [loading, setloading] = useState(false);
  const [data, setdata] = useState("");
  const [toggle, settoggle] = useState(true);
  const [menutoggle, setmenutoggle] = useState(false);
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  const formatYouTubeLink = (url) => {
    if (typeof url === "string") {
      return (
        url
          .replace("watch?v=", "embed/")
          .replace("youtu.be/", "www.youtube.com/embed/") +
        "?autoplay=1&controls=0&rel=0&modestbranding=1"
      );
    } else {
      return ""; // Handle the case where url is not a string
    }
  };

  const handlesubmit = async () => {
    setloading(true);
    // https://youtu.be/khUaF36F_SY
    const url = "http://localhost:5000/api/auth/uploadvideo";
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
        academyname: academyname,
        link: videolink,
      }),
    });

    setTimeout(async () => {
      if (response.ok) {
        setloading(false);
        const final = await response.json();
        setdata(final);
        setvideolink("");
        toast.success("Video Uploaded Successfully");
      } else {
        setloading(false);
        toast.error("Invalid Youtube Link");
      }
    }, 2000);
  };

  const handleback = () => {
    settoggle(false);
    setloading(true);

    setTimeout(() => {
      setloading(false);
      setmenutoggle(true);
    }, 2000);
  };
  console.log(data);
  console.log(data.link);

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            zIndex: 9999,
          }}
        >
          <Loader />
        </div>
      )}

      {toggle && (
        <div className="flex flex-col items-center justify-center p-4 space-y-6">
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "100%" },
              maxWidth: "600px",
              width: "100%",
              marginTop: "50px",
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="YouTube Link"
              variant="outlined"
              fullWidth
              onChange={(e) => setvideolink(e.target.value)}
            />
          </Box>
          <Typography sx={{ color: "#283255", textAlign: "center" }}>
            Please insert a YouTube video link above
          </Typography>

          <Button
            variant="contained"
            sx={{
              maxWidth: "200px",
              width: "100%",
            }}
            onClick={handlesubmit}
          >
            Upload
          </Button>

          {data.link && (
            <div
              style={{
                width: "100%",
                maxWidth: "640px",
                aspectRatio: "16/9",
                marginTop: "40px",
                marginBottom: "40px",
              }}
            >
              <iframe
                width="100%"
                height="100%"
                src={formatYouTubeLink(data.link)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-md"
              ></iframe>
            </div>
          )}

          <div className="flex justify-end w-full">
            <Button
              variant="contained"
              onClick={handleback}
              sx={{
                maxWidth: "150px",
                marginRight: "20px",
              }}
            >
              Back
            </Button>
          </div>
        </div>
      )}

      {menutoggle && <MediaMenu />}
    </>
  );
}
