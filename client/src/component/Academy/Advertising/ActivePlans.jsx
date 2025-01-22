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
import ContentUpload from "./ContentUpload";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

function PlansTable({ records }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  console.log(records);

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
    paymentdate: record.paymentdate || "N/A",
    expirydate: record.expirydate || "N/A",
  }));

  const columns = [
    { accessorKey: "advertiseName", header: "Advertise Name", size: 150 },
    { accessorKey: "academyCity", header: "City", size: 100 },
    { accessorKey: "amount", header: "Amount", size: 100 },
    { accessorKey: "paymentStatus", header: "Payment Status", size: 100 },
    { accessorKey: "paymentdate", header: "Start Date", size: 100 },
    { accessorKey: "expirydate", header: "Expiry Date", size: 100 },
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
            disableInteractive={false}
          >
            {row.original.bannerLink === "pending" ? (
              <span>
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
            ) : (
              <span>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ border: "none" }}
                  disabled={isPaymentPending}
                  onClick={() => handleOpenDialog(row.original)}
                >
                  <EditIcon />
                </Button>
              </span>
            )}
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "bannerLink",
      header: "Uploaded Banner",
      size: 150,
      Cell: ({ row }) => {
        if (row.original.bannerLink !== "pending") {
          return (
            <span>
              {" "}
              <img
                src={row.original.bannerLink}
                alt="Banner"
                width={150}
                height={100}
              ></img>
            </span>
          );
        } else {
          return (
            <span>
              <h2 className="text-sm"> Not Uploaded</h2>
            </span>
          );
        }
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
        <DialogTitle>Upload Advertisement Content</DialogTitle>
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
            <ContentUpload
              record={selectedRow}
              onClose={() => {
                handleCloseDialog();
              }}
            />
          ) : (
            <Typography>No Details Available</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PlansTable;
