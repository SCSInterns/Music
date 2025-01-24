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
import PreviewIcon from "@mui/icons-material/Preview";
import CloseIcon from "@mui/icons-material/Close";

function PlansTable({ records }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Transform records to fit the desired table structure
  const transformedRecords = records.map((record) => ({
    id: record?._id?.$oid || "N/A",
    city: record.academycity || "N/A",
    academyName: record.academyname || "N/A",
    advertiseName: record.advertisename || "N/A",
    expiryDate: record.expirydate || "N/A",
    paymentStatus: record.paymentstatus || "N/A",
    details: record,
  }));

  const columns = [
    { accessorKey: "academyName", header: "Academy Name", size: 150 },
    { accessorKey: "city", header: "City", size: 150 },
    { accessorKey: "advertiseName", header: "Advertise Name", size: 150 },
    { accessorKey: "expiryDate", header: "Expiry Date", size: 150 },
    { accessorKey: "paymentStatus", header: "Payment Status", size: 150 },
    {
      accessorKey: "actions",
      header: "Preview Details",
      size: 150,
      Cell: ({ row }) => (
        <Tooltip title="View Details">
          <Button
            variant="outlined"
            color="primary"
            style={{ border: "none" }}
            onClick={() => handleOpenDialog(row.original.details)}
          >
            <PreviewIcon />
          </Button>
        </Tooltip>
      ),
    },
  ];

  const handleOpenDialog = (rowDetails) => {
    setSelectedRow(rowDetails);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

  const tableHeaderStyle = {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    textAlign: "left",
    padding: "8px",
    borderBottom: "1px solid #ddd",
  };

  const tableCellStyle = {
    padding: "8px",
    borderBottom: "1px solid #ddd",
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
        <DialogTitle>
          Preview Details
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
        </DialogTitle>

        <DialogContent>
          {selectedRow ? (
            <Box sx={{ my: 2, overflowX: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Field</th>
                    <th style={tableHeaderStyle}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tableCellStyle}>Academy Name</td>
                    <td style={tableCellStyle}>
                      {selectedRow.academyname || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>City</td>
                    <td style={tableCellStyle}>
                      {selectedRow.academycity || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>Advertise Name</td>
                    <td style={tableCellStyle}>
                      {selectedRow.advertisename || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>Payment Status</td>
                    <td style={tableCellStyle}>
                      {selectedRow.paymentstatus || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>Payment Date</td>
                    <td style={tableCellStyle}>
                      {selectedRow.paymentdate || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>Amount</td>
                    <td style={tableCellStyle}>
                      {selectedRow.amount || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>Mode of Payment</td>
                    <td style={tableCellStyle}>
                      {selectedRow.paymentmode || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>Expiry Date</td>
                    <td style={tableCellStyle}>
                      {selectedRow.expirydate || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>Banner Link</td>
                    <td style={tableCellStyle}>
                      {selectedRow.bannerlink || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>Website Link</td>
                    <td style={tableCellStyle}>
                      {selectedRow.websitelink || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
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
