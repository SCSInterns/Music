import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Collapse,
  TextField,
} from "@mui/material";

function StatusHandler({
  admin,
  handlestatus,
  credsend,
  inputChange,
  handlesharecred,
}) {
  return (
    <>
      {admin.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            mt: 3,
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Typography variant="h6" sx={{ flexBasis: "100%", mb: 1 }}>
            Choose Action:
          </Typography>

          <Button
            variant="contained"
            sx={{
              minWidth: "120px",
              backgroundColor: "#060d15",
              padding: "10px 20px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#171473",
              },
            }}
            startIcon={<CheckCircleIcon />}
            onClick={() => handlestatus(admin[0]._id, "Accept")}
          >
            Accept
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#060d15",
              minWidth: "120px",
              padding: "10px 20px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#171473",
              },
            }}
            startIcon={<CancelIcon />}
            onClick={() => handlestatus(admin[0]._id, "Reject")}
          >
            Reject
          </Button>
        </Box>
      )}

      {/* Credential Sharing */}
      {credsend && (
        <Collapse in={credsend}>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Set Academy Credentials
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="username"
                label="Academy Username"
                onChange={inputChange}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label="Academy Password"
                onChange={inputChange}
                fullWidth
                margin="dense"
              />
            </Grid>
          </Grid>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              onClick={() =>
                handlesharecred(admin[0].academy_email, admin[0]._id)
              }
            >
              Send Email
            </Button>
          </Box>
        </Collapse>
      )}
    </>
  );
}

export default StatusHandler;
