import React from "react";
import { useState } from "react";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import Addlogo from "../Media/Addlogo";

import { Button, Typography } from "@mui/material";
import Addvideo from "./Addvideo";
import Addphotos from "./Addphotos";

const MediaMenu = () => {
  const [logo, setlogo] = useState(false);
  const [toggle, settoggle] = useState(true);
  const [video, setvideo] = useState(false);
  const [photo, setphoto] = useState(false);

  const handleAddBusinessClick = () => {
    setlogo(true);
    settoggle(false);
    setvideo(false);
    setphoto(false);
  };

  const handleAddPhotoClick = () => {
    setlogo(false);
    settoggle(false);
    setvideo(false);
    setphoto(true);
  };

  const handleVideoCallClick = () => {
    setlogo(false);
    settoggle(false);
    setvideo(true);
    setphoto(false);
  };

  const icons = [
    { component: AddBusinessIcon, onClick: handleAddBusinessClick },
    { component: AddAPhotoIcon, onClick: handleAddPhotoClick },
    { component: VideoCallIcon, onClick: handleVideoCallClick },
  ];

  const description = [
    "Add Academy's logo",
    "Add Academy's Photo",
    "Add Academy's Video",
  ];

  return (
    <>
      {toggle && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <div style={styles.gridContainer}>
              {icons.map((iconData, index) => {
                const IconComponent = iconData.component;
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Button onClick={iconData.onClick}>
                      <div style={styles.iconWrapper}>
                        <IconComponent style={styles.icon} />
                      </div>
                    </Button>
                    <Typography
                      variant="subtitle1"
                      style={{ marginTop: "10px" }}
                    >
                      {description[index]}
                    </Typography>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {logo && (
        <>
          <Addlogo />
        </>
      )}

      {video && (
        <>
          <Addvideo />
        </>
      )}

      {photo && (
        <>
          <Addphotos />
        </>
      )}
    </>
  );
};

const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  iconWrapper: {
    width: "100px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #283255",
    padding: "10px",
    borderRadius: "10px",
  },
  icon: {
    fontSize: "60px",
    color: "#0d1b2a",
  },
};

export default MediaMenu;
