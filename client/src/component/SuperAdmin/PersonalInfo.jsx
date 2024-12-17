import React from "react";
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

function PersonalInfo({ details, renderTableRows }) {
  return (
    <>
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Personal Data
      </Typography>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {renderTableRows([
            { label: "Name", value: details.name },
            { label: "Address", value: details.address },
            { label: "Contact No.", value: details.contactno },
          ])}
        </tbody>
      </table>
    </>
  );
}

export default PersonalInfo;
