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
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import AddchartIcon from "@mui/icons-material/Addchart";
import Token from "../Token/Token";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import QrScan from "./QrScan";
import ReportIcon from "@mui/icons-material/Assessment";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import SummarizeIcon from "@mui/icons-material/Summarize";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PaymentsIcon from "@mui/icons-material/Payments";
import ApplicantsTable from "./AppliacantsTable";
import PendingFeesTable from "./PendingFeesTable";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Content from "./WebContentMenu";
import Batchmenu from "./Batchmenu";
import Loader from "../Loader/Loader";
import FormManagementMenu from "./FormManagementMenu";
import ApplicantsListMenu from "./ApplicantsListMenu";
import PaymentMenu from "../AcademyPayment/PaymentMenu";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentRequest from "./PaymentRequest";
import { io } from "socket.io-client";
import Billing from "./BillingMenu";
import { useLocation, useNavigate } from "react-router-dom";
import DynamicFormMenu from "./DynamicForm/DynmaicFormMenu";
import BatchMenuV2 from "./BatchManagement/BatchMenuV2";
import { AccountCircleOutlined, AddBusiness } from "@mui/icons-material";
import AccountMenu from "./AccountMng/AccountMenu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Megaphone, Volume2 } from "lucide-react";
import AdvretisingMenu from "./Advertising/AdvretisingMenu";
import EventMenu from "./EventMng/EventMenu";
import { LogOut, KeyRound } from "lucide-react";
import ChangePasswordModal from "./ChangePwd";

const Sidebar = () => {
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");
  const socket = React.useRef(null);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [appdata, setappdata] = useState([]);
  const [toggleapplicants, settoggleapplicants] = useState(false);
  const [passpaymentdetails, setpasspaymentdetails] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    handleCloseMenu();
    const keysToRemove = [
      "academyid",
      "academyname",
      "refreshtoken",
      "accesstoken",
      "role",
    ];
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
    navigate("/Business", { replace: true });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const drawerWidth = collapsed ? 80 : 300;

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
      }, 2000);
    }
  };

  const handleapplicantslist = () => {
    handleApplicants();
  };

  const startSocket = () => {
    socket.current.on("newData", (newEntry) => {
      setappdata((prevEntries) => [newEntry, ...prevEntries]);
    });
  };
  useEffect(() => {
    socket.current = io("http://localhost:5000");
    startSocket();
    return () => {
      socket.current.off("newData");
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    handleApplicants();
    handleFees();
  }, [academyname]);

  console.log(appdata);

  const location = useLocation();
  const status = location.state?.status;
  const academyid = location.state?.academyid;

  const [activeComponent, setActiveComponent] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [info, setinfo] = useState([]);

  const fetchlist = async (academyname, adminid) => {
    const url = `http://localhost:5000/api/auth/getsubspaymentlist`;

    let token = Token();
    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyname: academyname,
          role: "Superadmin",
          adminid: adminid,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setinfo(data);
      }
    } catch (error) {
      toast.error("Network error", error);
    }
  };

  const handleMenuClick = () => {
    setOpenMenu(true);
  };

  useEffect(() => {
    if (academyname && academyid) {
      fetchlist(academyname, academyid);
    }
  }, [academyname]);

  useEffect(() => {
    if (status === "Reject") {
      setActiveComponent("Billing");
    } else {
      setActiveComponent("Applicants Data");
    }
  }, [status]);

  const menuItems = [
    {
      text: "Applicants Data",
      icon: <FolderSharedIcon />,
      component: (
        <ApplicantsListMenu
          users={appdata}
          handleapplicantslist={handleapplicantslist}
        />
      ),
      disabled: status === "Accept" ? false : true,
    },
    // {
    //   text: "Batch Management",
    //   icon: <ReportIcon />,
    //   component: <Batchmenu />,
    //   disabled: status === "Accept" ? false : true,
    // },

    // {
    //   text: "Attendance",
    //   icon: <GroupsIcon />,
    //   component: <QrScan />,
    //   disabled: status === "Accept" ? false : true,
    // },
    // {
    //   text: "Pending Fees",
    //   icon: <PendingActionsIcon />,
    //   component: <PendingFeesTable data={passpaymentdetails} />,
    //   disabled: status === "Accept" ? false : true,
    // },
    // {
    //   text: "Form Management",
    //   icon: <InsertDriveFileIcon />,
    //   component: <FormManagementMenu />,
    //   disabled: status === "Accept" ? false : true,
    // },
    {
      text: "Credentials Setup",
      icon: <PaymentsIcon />,
      component: <PaymentMenu />,
      disabled: status === "Accept" ? false : true,
    },
    // {
    //   text: "Form Builder 🆕",
    //   icon: <InsertDriveFileIcon />,
    //   component: <DynamicFormMenu />,
    //   disabled: status === "Accept" ? false : true,
    // },
    // {
    //   text: "Payment Requests",
    //   icon: <AccountBalanceIcon />,
    //   component: <PaymentRequest />,
    //   disabled: status === "Accept" ? false : true,
    // },
    {
      text: "Website Content",
      icon: <DashboardIcon />,
      component: <Content />,
      disabled: status === "Accept" ? false : true,
    },
    {
      text: "Billing",
      icon: <CurrencyRupeeIcon />,
      component: <Billing academyid={academyid} info={info} />,
      disabled: status === "Accept" ? false : false,
    },
    {
      text: "Batch Management",
      icon: <AddchartIcon />,
      component: <BatchMenuV2 />,
      disabled: status === "Accept" ? false : true,
    },
    {
      text: "Account Management",
      icon: <AddBusiness />,
      component: <AccountMenu />,
      disabled: status === "Accept" ? false : true,
    },
    {
      text: "Advertising",
      icon: <Volume2 />,
      component: <AdvretisingMenu />,
      disabled: status === "Accept" ? false : true,
    },
    {
      text: "Event Management",
      icon: <GroupsIcon />,
      component: <EventMenu />,
      disabled: status === "Accept" ? false : true,
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        backgroundColor: "#0d1b2a",
        color: "#fff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          padding: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          ml: collapsed ? 0 : 2,
        }}
      >
        {!collapsed && (
          <Typography variant="h8" sx={{ fontWeight: "bold", color: "#fff" }}>
            <button onClick={() => handleMenuClick()}>
              <AccountCircleOutlined className="mr-4" fontSize="medium" />
            </button>
            Admin Dashboard
          </Typography>
        )}
        <IconButton
          onClick={toggleCollapse}
          sx={{ color: "#fff", border: "1px white solid", borderRadius: "40%" }}
        >
          {collapsed ? (
            <ChevronRightIcon fontSize="small" />
          ) : (
            <ChevronLeftIcon fontSize="small" />
          )}
        </IconButton>
      </Box>
      <Divider sx={{ backgroundColor: "#2e3b4e" }} />
      <List>
        {menuItems.map((item, index) => (
          <Tooltip
            title={collapsed ? item.text : ""}
            placement="right"
            key={index}
          >
            <ListItem
              button
              key={index}
              onClick={() => setActiveComponent(item.text)}
              disabled={item.disabled}
              sx={{
                backgroundColor:
                  activeComponent === item.text ? "#2e3b4e" : "transparent",
                paddingY: "12px !important",
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} />}
            </ListItem>
          </Tooltip>
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

      <Menu
        open={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          marginTop: "50px",
          marginRight: "20px",
        }}
      >
        {/* start from here  */}
        <MenuItem onClick={handleOpen}>
          {<KeyRound size={18} className="mr-2" />}
          Change Credentials
        </MenuItem>
        <ChangePasswordModal open={open} handleClose={handleClose} />
        <MenuItem onClick={handleLogout}>
          {<LogOut size={18} className="mr-2" />}Logout
        </MenuItem>
      </Menu>

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
              width: drawerWidth,
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
            overflowX: "hidden",
            paddingLeft: `${drawerWidth}px`,
            backgroundColor: "#f1f5f9",
            height: "100vh",
            transition: "padding-left 0.3s ease",
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
