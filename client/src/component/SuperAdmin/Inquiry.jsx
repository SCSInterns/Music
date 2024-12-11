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
import { toast } from "react-toastify";

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
    const url = `http://localhost:5000/api/superadmin/academycredentials/${id}`;
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
    const url = `http://localhost:5000/api/auth/sendcred`;
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
      const url = `http://localhost:5000/api/superadmin/academyacess/${id}`;
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
      const url = `http://localhost:5000/api/superadmin/detailsofadminbyid/${id}`;
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
        const url = `http://localhost:5000/api/superadmin/academydetails`;
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
      let url = `http://localhost:5000/api/auth/preview/${id}`;
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
      url = `http://localhost:5000/api/auth/academybyname`;
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
      <div style={{ textAlign: "center" }}>Dashboard</div>
      <TableContainer sx={{ maxHeight: 400, marginTop: "50px" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Academy Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Pincode</TableCell>
              <TableCell>Contact No</TableCell>
              <TableCell>Preview</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {academy.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.academy_name}</TableCell>
                <TableCell>{item.academy_address}</TableCell>
                <TableCell>{item.academy_city}</TableCell>
                <TableCell>{item.academy_state}</TableCell>
                <TableCell>{item.academy_pincode}</TableCell>
                <TableCell>{item.academy_contactno}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handlePreview(item._id, item.academy_name)}
                  >
                    <PreviewIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Academy Details
          </Typography>

          <Divider />
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Academy Data:</Typography>
                <TextField
                  label="ID"
                  value={details._id || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Name"
                  value={details.academy_name || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Address"
                  value={details.academy_address || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="City"
                  value={details.academy_city || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="State"
                  value={details.academy_state || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Pincode"
                  value={details.academy_pincode || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Contact No"
                  value={details.academy_contactno || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Personal Data:</Typography>
                <TextField
                  label="Name"
                  value={details.name || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Address"
                  value={details.address || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Contact no. "
                  value={details.contactno || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Divider sx={{ marginTop: "10px" }} />
                <Typography variant="h6" marginTop={2}>
                  Access Data:
                </Typography>
                {admin.length > 0 && (
                  <>
                    <TextField
                      label="Academy Name"
                      value={admin[0].academy_name || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="Username"
                      value={admin[0].academy_username || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="Password"
                      value={admin[0].academy_password || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="Email"
                      value={admin[0].academy_email || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="Access"
                      value={admin[0].academy_access || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="Url"
                      value={admin[0].academy_url || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        margin: "20px",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handlestatus(admin[0]._id, "Accept")}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handlestatus(admin[0]._id, "Reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  </>
                )}
              </Grid>
            </Grid>

            {credsend ? (
              <>
                {" "}
                <Typography style={{ marginTop: "30px" }}>
                  Set Academy Credentials:
                </Typography>
                <div
                  style={{
                    display: "flex",
                    marginTop: "20px",
                    justifyContent: "space-evenly",
                  }}
                >
                  <TextField
                    name="username"
                    label="Academy username"
                    onChange={inputChange}
                  />
                  <TextField
                    name="password"
                    label="Academy password"
                    onChange={inputChange}
                  />
                </div>
                <div>
                  <Button
                    variant="contained"
                    sx={{ margin: "40px" }}
                    onClick={() =>
                      handlesharecred(admin[0].academy_email, admin[0]._id)
                    }
                  >
                    Send email
                  </Button>
                </div>
              </>
            ) : (
              <div></div>
            )}
          </Box>
          <Button onClick={handleClose} color="error" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default Dashboard;
