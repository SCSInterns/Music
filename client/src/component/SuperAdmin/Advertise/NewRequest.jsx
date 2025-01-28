import React, { useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  MenuItem,
  Tooltip,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import Token from "../../Token/Token";
import { toast } from "react-toastify";

function PlansTable({ records, onUpdate }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [paymentdate, setpaymentdate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const token = Token();
  const role = sessionStorage.getItem("role");

  const handleSubmitPaymentDetails = async () => {
    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/addadvrpayment";

    const formatdate = paymentdate.split("-").reverse().join("-");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        role: role,
        id: selectedRow.id,
        paymentmode: paymentMode,
        paymentdate: formatdate,
      }),
    });

    const data = await response.json();
    const msg = data.message;

    if (response.ok) {
      toast.success(msg);
      setDialogOpen(false);
      onUpdate();
    } else {
      toast.error(msg);
    }
  };

  const transformedRecords = records.map((record) => ({
    id: record?._id || "N/A",
    academyName: record.academyname || "N/A",
    academyCity: record.academycity || "N/A",
    amount: record.amount || "N/A",
    advertiseName: record.advertisename || "N/A",
    paymentStatus: record.paymentstatus || "N/A",
    bannerLink: record.bannerlink || "N/A",
    websiteLink: record.websitelink || "N/A",
    section: record.section || "N/A",
    date: record.date || "N/A",
  }));

  const columns = [
    { accessorKey: "academyName", header: "Academy Name", size: 150 },
    { accessorKey: "academyCity", header: "City", size: 150 },
    { accessorKey: "amount", header: "Amount", size: 100 },
    { accessorKey: "advertiseName", header: "Advertise Name", size: 150 },
    { accessorKey: "paymentStatus", header: "Payment Status", size: 150 },
    { accessorKey: "date", header: "Date", size: 150 },
    {
      accessorKey: "actions",
      header: "Add Payment",
      size: 150,
      Cell: ({ row }) => {
        return (
          <Button
            variant="outlined"
            color="primary"
            style={{ border: "none" }}
            onClick={() => handleOpenDialog(row.original)}
          >
            <AddBoxIcon />
          </Button>
        );
      },
    },
  ];

  const handleOpenDialog = (row) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

  return (
    <>
      <div style={{ marginTop: "20px" }}>
        <MaterialReactTable columns={columns} data={transformedRecords} />
      </div>

      {/* Dialog Box */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Details</DialogTitle>

        {/* Close Icon */}
        <CloseIcon
          onClick={handleCloseDialog}
          style={{
            position: "absolute",
            right: "16px",
            top: "16px",
            cursor: "pointer",
            color: "red",
            border: "1px solid red",
            padding: 2,
          }}
          fontSize="small"
        />

        <DialogContent>
          {selectedRow ? (
            <Box sx={{ my: 2 }}>
              {/* Payment Date */}
              <div>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Payment Date
                </Typography>
                <input
                  type="date"
                  id="datePicker"
                  name="datePicker"
                  value={paymentdate}
                  onChange={(e) => setpaymentdate(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    width: "100%",
                    height: "50px",
                    border: "1px solid #ddd",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    fontSize: "14px",
                    backgroundColor: "#f9f9f9",
                  }}
                />
              </div>

              {/* Mode of Payment */}
              <div className="mt-3">
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Mode of Payment
                </Typography>
                <TextField
                  select
                  value={paymentMode}
                  onChange={(event) => setPaymentMode(event.target.value)}
                  variant="outlined"
                  fullWidth
                  placeholder="Select Payment Mode"
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="NetBanking">Net Banking</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                </TextField>
              </div>
            </Box>
          ) : (
            <Typography>No Details Available</Typography>
          )}
        </DialogContent>

        {/* Submit Button */}
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmitPaymentDetails()}
            disabled={!paymentdate || !paymentMode}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PlansTable;
