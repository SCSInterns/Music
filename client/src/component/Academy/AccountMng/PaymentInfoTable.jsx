import React, { useState } from "react";
import { MaterialReactTable } from "material-react-table";
import PaymentIcon from "@mui/icons-material/Payment";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AccountPaymentBox from "./AccountPaymentBox";
import AddCardIcon from "@mui/icons-material/AddCard";
import AdvancePaymentBox from "./AdvancePaymentBox";

function AttendanceTable({ records, fetchList }) {
  const [open, setOpen] = useState(false);
  const [openAdvancePayment, setOpenAdvancePayment] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleChange = async () => {
    setOpen(false);
    fetchList();
  };

  const handleAdvChange = async () => {
    setOpenAdvancePayment(false);
    fetchList();
  };

  const handleAddPayment = (record) => {
    setSelectedRecord(record);
    setOpen(true);
  };

  const handleAdvPayment = (record) => {
    setSelectedRecord(record);
    setOpenAdvancePayment(true);
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
          disabled={row.original.outstandingamount <= 0}
          sx={{ color: "#0d1b2a" }}
          onClick={() => handleAddPayment(row.original)}
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
    {
      accessorKey: "mobileno",
      header: "Mobile No",
      size: 200,
    },
    {
      accessorKey: "advance amount",
      header: "Add Advance Payment",
      size: 100,
      Cell: ({ row }) => (
        <Button
          disabled={row.original.outstandingamount > 0}
          sx={{ color: "#0d1b2a" }}
          onClick={() => handleAdvPayment(row.original)}
        >
          <AddCardIcon />
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Payment Dialog */}
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

      {/* Advance Payment Dialog */}
      <Dialog
        open={openAdvancePayment}
        onClose={() => setOpenAdvancePayment(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <AdvancePaymentBox
            close={() => setOpenAdvancePayment(false)}
            onChange={handleAdvChange}
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
