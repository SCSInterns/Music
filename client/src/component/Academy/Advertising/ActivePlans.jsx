import React, { useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Tooltip,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

function PlansTable({ records }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const transformedRecords = records.map((record) => ({
    id: record._id?.$oid || "N/A",
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
      header: "Add Content",
      size: 150,
      Cell: ({ row }) => {
        const isPaymentPending = row.original.paymentStatus === "Pending";

        return (
          <Tooltip
            title={isPaymentPending ? "Please Pay First" : "Add Content"}
            placement="bottom"
            disableInteractive={isPaymentPending}
          >
            <span>
              {" "}
              <Button
                variant="outlined"
                color="primary"
                style={{ border: "none" }}
                disabled={isPaymentPending}
                onClick={() => handleOpenDialog(row.original)}
              >
                <AddBoxIcon />
              </Button>
            </span>
          </Tooltip>
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
        <DialogContent>
          {selectedRow ? (
            <Box>
              <Typography>Academy Name: {selectedRow.academyName}</Typography>
            </Box>
          ) : (
            <Typography>No Details Available</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PlansTable;
