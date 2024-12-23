import React, { useState } from "react";
import { MaterialReactTable } from "material-react-table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

function ActiveFreeTrial({ activeRequest }) {
  const [previewData, setPreviewData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreviewOpen = (data) => {
    setPreviewData(data);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPreviewData(null);
  };

  const columns = [
    {
      accessorKey: "accessDetails.academy_name",
      header: "Academy name",
      size: 150,
    },
    {
      accessorKey: "accessDetails.academy_email",
      header: "Academy Email",
      size: 150,
    },
    {
      accessorKey: "accessDetails.paymentstatus",
      header: "Paymentstatus",
      size: 100,
    },
    {
      accessorKey: "Preview",
      header: "Preview",
      size: 100,
      Cell: ({ row }) => (
        <Button
          sx={{ color: "#0d1b2a" }}
          onClick={() => handlePreviewOpen(row.original)}
        >
          <VisibilityIcon />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginTop: "20px" }}>
        <MaterialReactTable columns={columns} data={activeRequest} />
      </div>

      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Music Academy Details</DialogTitle>
        <DialogContent>
          {previewData && (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Academy Name</strong>
                  </TableCell>
                  <TableCell>
                    {previewData?.musicAcademyDetails?.academy_name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Address</strong>
                  </TableCell>
                  <TableCell>
                    {previewData?.musicAcademyDetails?.academy_address}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>City</strong>
                  </TableCell>
                  <TableCell>
                    {previewData?.musicAcademyDetails?.academy_city}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>State</strong>
                  </TableCell>
                  <TableCell>
                    {previewData?.musicAcademyDetails?.academy_state}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Pincode</strong>
                  </TableCell>
                  <TableCell>
                    {previewData?.musicAcademyDetails?.academy_pincode}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Contact No</strong>
                  </TableCell>
                  <TableCell>
                    {previewData?.musicAcademyDetails?.academy_contactno}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>GST No</strong>
                  </TableCell>
                  <TableCell>
                    {previewData?.musicAcademyDetails?.academy_gstno}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handlePreviewClose}
            variant="contained"
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ActiveFreeTrial;
