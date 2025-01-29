import React, { useEffect, useState } from "react";
import Dashboardsidebar from "./Dashboardsidebar";
import { useNavigate } from "react-router-dom";
import Email from "../SuperAdminEmail/SuperAdminEmail";
import Token from "../Token/Token";
import PreviewIcon from "@mui/icons-material/Preview";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { toast } from "react-toastify";
import DetailedInfo from "./DetailedInfo";
import { MaterialReactTable } from "material-react-table";

function Dashboard() {
  const superadminemail = Email();
  const [academy, setAcademy] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [details, setDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [credsend, setcredsend] = useState(false);

  useEffect(() => {
    if (admin.academy_access === "Accept") {
      setcredsend(true);
    }
    if (admin.academy_access === "Reject") {
      setcredsend(false);
    }
  }, [admin.academy_access]);

  const navigate = useNavigate();

  const columns = [
    {
      accessorKey: "academy_name",
      header: "academy_name",
      size: 100,
    },
    {
      accessorKey: "academy_address",
      header: "academy_address",
      size: 300,
    },
    {
      accessorKey: "academy_city",
      header: "academy_city",
      size: 100,
    },
    {
      accessorKey: "contactno",
      header: "contactno",
      size: 100,
    },
    {
      accessorKey: "More Info",
      header: "More Info",
      size: 100,
      Cell: ({ row }) => (
        <Button
          sx={{ color: "#0d1b2a" }}
          onClick={() => {
            handlePreview(row.original._id, row.original.academy_name);
          }}
        >
          <AccountCircleIcon />
        </Button>
      ),
    },
  ];

  console.log(academy);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [academycred, setacademycred] = useState({
    username: "",
    password: "",
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setacademycred((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setcredentials = async (id) => {
    const url = `https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/superadmin/academycredentials/${id}`;
    const academyurl = `http://localhost:3000/${admin[0].academy_name}`;
    const token = Token();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: academycred.username,
        password: academycred.password,
        url: academyurl,
      }),
    });

    if (response.ok) {
      toast.success("Credentials set successfully");
      await fetchadmindetailsbyid(id);
    } else {
      toast.error("Credentials not set");
    }
  };

  const handlesharecred = async (email, id) => {
    const url = `https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/sendcred`;
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: academycred.username,
        password: academycred.password,
      }),
    });

    if (response.ok) {
      await setcredentials(id);
      toast.success("Credentials sent successfully");
      await handlePreview(details._id, details.academy_name);
    } else {
      toast.error("Failed to send credentials");
    }
  };

  const handlestatus = async (id, status) => {
    try {
      const url = `https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/superadmin/academyacess/${id}`;
      const token = Token();
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status }),
      });

      if (response.ok) {
        toast.success("Status Updated Successfully");
        await fetchadmindetailsbyid(id);
        if (details.academy_name) {
          await handlePreview(details._id, details.academy_name);
        } else {
          console.error("Academy name is not available in details");
        }
      } else {
        toast.error("Status not updated");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const fetchadmindetailsbyid = async (id) => {
    try {
      const url = `https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/superadmin/detailsofadminbyid/${id}`;
      const token = Token();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdmin(data); // Update admin details
      } else {
        console.error("Failed to fetch admin details");
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  useEffect(() => {
    if (!superadminemail) return;

    const fetchData = async () => {
      try {
        const token = Token();
        const url = `https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/superadmin/academydetails`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: superadminemail }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setAcademy(data); // Update academy details
      } catch (error) {
        console.error("Error fetching academy details:", error);
      }
    };

    fetchData();
  }, [superadminemail]);

  const handlePreview = async (id, academyName) => {
    try {
      const token = Token();

      // Fetch preview details
      let url = `https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/preview/${id}`;
      let response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const previewData = await response.json();
      setDetails(previewData); // Update details

      // Fetch academy details by name
      url = `https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/academybyname`;
      response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ academy_name: academyName }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const academyData = await response.json();
      setAdmin(academyData); // Update admin details
      // Set modal data and open modal
      setOpen(true);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  return (
    <>
      <div style={{ marginTop: "20px" }}>
        <MaterialReactTable columns={columns} data={academy} />
      </div>

      {open && (
        <DetailedInfo
          details={details}
          admin={admin}
          handleClose={handleClose}
          handlestatus={handlestatus}
          open={open}
          handlesharecred={handlesharecred}
          inputChange={inputChange}
          credsend={credsend}
        />
      )}
    </>
  );
}

export default Dashboard;
