import React from "react";
import Fab from "@mui/material/Fab";
import PhoneIcon from "@mui/icons-material/Phone";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";

const VideoPlayer = () => {
  const videoId = "Dej6YePFSMU";
  const phoneNumber = "+1234567890";

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <iframe
          width="80%"
          height="80%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <Tooltip title="Help Center" placement="bottom">
        <Fab
          component="a"
          href={`tel:${phoneNumber}`}
          target="_self"
          color="secondary"
          size="small"
          aria-label="call"
          sx={{
            position: "fixed",
            bottom: 80,
            right: 30,
            backgroundColor: "#0d1b2a",
            "&:hover": {
              backgroundColor: "#0d1b2a",
            },
          }}
        >
          <PhoneIcon />
        </Fab>
      </Tooltip>
    </>
  );
};

export default VideoPlayer;
