import React, { useEffect, useState } from "react";
import Dashboardsidebar from "./Dashboardsidebar";
import { Modal, Box, Typography, Button, TextField, Grid } from "@mui/material";
import Divider from "@mui/material/Divider";
import { toast } from "react-toastify";
import Token from "../Token/Token";
import PreviewIcon from "@mui/icons-material/Preview";

function Dashboard() {
  const [accessData, setAccessData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    const fetchAccessData = async () => {
      try {
        const token = Token();
        const url = `https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/superadmin/filterforaccess`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Accept",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setAccessData(data);
        } else {
          throw new Error("Failed to fetch access data");
        }
      } catch (error) {
        console.error("Error fetching access data:", error);
      }
    };

    fetchAccessData();
  }, []);

  const handleOpen = (data) => {
    setSelectedData(data);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Dashboardsidebar />
      <div style={{ textAlign: "center", fontSize: "24px", marginTop: "20px" }}>
        Dashboard
      </div>
      <div style={{ margin: "20px", overflowX: "auto" }}>
        <table
          className="min-w-half leading-normal"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr>
              <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Academy Name
              </th>
              <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Username
              </th>
              <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Access
              </th>
              <th className="px-4 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Preview
              </th>
            </tr>
          </thead>
          <tbody>
            {accessData.map((item) => (
              <tr key={item._id}>
                <td className="px-4 py-4 border-b border-gray-200 bg-white text-sm">
                  {item.academy_name}
                </td>
                <td className="px-4 py-4 border-b border-gray-200 bg-white text-sm">
                  {item.academy_username}
                </td>
                <td className="px-4 py-4 border-b border-gray-200 bg-white text-sm">
                  {item.academy_email}
                </td>
                <td className="px-4 py-4 border-b border-gray-200 bg-white text-sm">
                  {item.academy_access}
                </td>
                <td className="px-4 py-4 border-b border-gray-200 bg-white text-sm">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpen(item)}
                    startIcon={<PreviewIcon />}
                  >
                    Preview
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            ...style,
            maxHeight: "80vh",
            overflowY: "auto",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Access Details
          </Typography>
          <Divider />
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Academy Data:</Typography>
                <TextField
                  label="Academy Name"
                  value={selectedData?.academy_name || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Username"
                  value={selectedData?.academy_username || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Email"
                  value={selectedData?.academy_email || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Access"
                  value={selectedData?.academy_access || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
            <Button
              onClick={handleClose}
              color="error"
              sx={{ mt: 2 }}
              variant="contained"
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default Dashboard;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
};
