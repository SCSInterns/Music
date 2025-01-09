import React, { useState } from "react";
import { MaterialReactTable } from "material-react-table";
import PaymentIcon from "@mui/icons-material/Payment";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AccountPaymentBox from "./AccountPaymentBox";

function AttendanceTable({ records, fetchList }) {
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleChange = async () => {
    setOpen(false);
    fetchList(); // Refresh the data after changes
  };

  const handleAddPayment = (record) => {
    setSelectedRecord(record); // Set the specific record
    setOpen(true); // Open the dialog
  };

  const columns = [
    {
      accessorKey: "studentname",
      header: "Student Name",
      size: 150,
    },
    {
      accessorKey: "installmentdate",
      header: "Installment Date",
      size: 100,
    },
    {
      accessorKey: "fees",
      header: "Fees",
      size: 100,
    },
    {
      accessorKey: "previousdue",
      header: "Previous Due",
      size: 100,
    },
    {
      accessorKey: "currentdue",
      header: "Current Due",
      size: 100,
    },
    {
      accessorKey: "outstandingamount",
      header: "Amount",
      size: 100,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
    },
    {
      accessorKey: "Add Payment",
      header: "Add Payment",
      size: 100,
      Cell: ({ row }) => (
        <Button
          disabled={row.original.outstandingamount === 0}
          sx={{ color: "#0d1b2a" }}
          onClick={() => handleAddPayment(row.original)} // Pass the specific record
        >
          <PaymentIcon />
        </Button>
      ),
    },
    {
      accessorKey: "batchname",
      header: "Batch Name",
      size: 200,
    },
  ];

  return (
    <>
      {/* Material-UI Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <AccountPaymentBox
            close={() => setOpen(false)}
            onChange={handleChange}
            record={selectedRecord}
          />
        </DialogContent>
      </Dialog>

      {/* The table */}
      <div style={{ marginTop: "20px" }}>
        <MaterialReactTable columns={columns} data={records} />
      </div>
    </>
  );
}

export default AttendanceTable;
