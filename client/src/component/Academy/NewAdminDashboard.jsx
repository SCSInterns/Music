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
import QrScan from "./QrScan";
import ReportIcon from "@mui/icons-material/Assessment";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ApplicantsTable from "./AppliacantsTable";
import PendingFeesTable from "./PendingFeesTable";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Content from "./WebContentMenu";
import Batchmenu from "./Batchmenu";
import Loader from "../Loader/Loader";

const Sidebar = () => {
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Website Content");

  const [loading, setloading] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [appdata, setappdata] = useState([]);
  const [toggleapplicants, settoggleapplicants] = useState(false);
  const [passpaymentdetails, setpasspaymentdetails] = useState([]);

  const token = Token();

  const handleApplicants = async () => {
    settoggleapplicants(true);
    let url = "http://localhost:5000/api/auth/getdata";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
      }),
    });

    const data = await response.json();

    if (Array.isArray(data)) {
      setloading(true);
      setTimeout(() => {
        setloading(false);
        setappdata(data);
        toast.success("Details Fetch Success");
      }, 2000);
    } else {
      toast.error("Error fetching details");
    }
  };

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const handleFees = async () => {
    const todaydate = getCurrentDate();
    const url = "http://localhost:5000/api/auth/getpaymnetdue";
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
        currentdate: todaydate,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setloading(true);
      setTimeout(() => {
        setloading(false);
        setpasspaymentdetails(data);
        toast.success("Payment Details Fetch Success");
      }, 2000);
    }
  };

  useEffect(() => {
    handleApplicants();
    handleFees();
  }, [academyname]);

  console.log(appdata);

  const menuItems = [
    {
      text: "Website Content",
      icon: <DashboardIcon />,
      component: <Content />,
    },

    { text: "Batch Menu", icon: <ReportIcon />, component: <Batchmenu /> },

    { text: "Attendance", icon: <GroupsIcon />, component: <QrScan /> },

    {
      text: "Applicants Data",
      icon: <FolderSharedIcon />,
      component: <ApplicantsTable users={appdata} />,
    },

    {
      text: "Pending Fees",
      icon: <PendingActionsIcon />,
      component: <PendingFeesTable data={passpaymentdetails} />,
    },
    {
      text: "Form Management",
      icon: <SummarizeIcon />,
      component: <InsertDriveFileIcon data={passpaymentdetails} />,
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
          {academyname} Admin Dashboard
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

        {/* Dynamic Component Rendering */}
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
