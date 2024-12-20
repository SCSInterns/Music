import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import Token from "../Token/Token";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import ReportIcon from "@mui/icons-material/Assessment";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SummarizeIcon from "@mui/icons-material/Summarize";
import PaymentsIcon from "@mui/icons-material/Payments";
import ThreePIcon from "@mui/icons-material/ThreeP";
import Loader from "../Loader/Loader";
import Inquiry from "./Inquiry";
import { io } from "socket.io-client";
import DemoInquiry from "./DemoInquiry";
import DemoMenu from "./DemoMenu";
import Freetrail from "./FreetrailMenu";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Academy List");

  const [loading, setloading] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    {
      text: "Academy List",
      icon: <FolderSharedIcon />,
      component: <Inquiry />,
    },
    {
      text: "Demo Inquiry",
      icon: <PersonAddAltIcon />,
      component: <DemoMenu />,
    },
    {
      text: "Free Trial List",
      icon: <ThreePIcon />,
      component: <Freetrail />,
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        width: { xs: 250, sm: 300 },
        backgroundColor: "#0d1b2a",
        color: "#fff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
          SuperAdmin Dashboard
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#2e3b4e" }} />
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => setActiveComponent(item.text)}
            sx={{
              backgroundColor:
                activeComponent === item.text ? "#2e3b4e" : "transparent",
              padding: 2,
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

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
            backgroundColor: "rgba(255, 255, 255,0.9)",
            zIndex: 9999,
          }}
        >
          <>
            <Loader />
          </>
        </div>
      )}

      <Box sx={{ display: "flex", backgroundColor: "#0d1b2a" }}>
        <div style={{ position: "relative" }}>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              marginRight: "20px",
              margin: 2,
              color: mobileOpen ? "#0d1b2a" : "#0d1b2a",
              display: { xs: "block", sm: "none" },
              zIndex: 1300,
            }}
          >
            <MenuIcon />
          </IconButton>
        </div>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 250,
              overflowX: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 300,
              overflowX: "hidden",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>

        <Box
          sx={{
            flex: 1,
            padding: 2,
            overflowX: "hidden",
            paddingLeft: { sm: 40 },
            backgroundColor: "#f1f5f9",
            height: "100vh",
          }}
        >
          {menuItems.map(
            (item) =>
              activeComponent === item.text && (
                <div key={item.text}>{item.component}</div>
              )
          )}
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
