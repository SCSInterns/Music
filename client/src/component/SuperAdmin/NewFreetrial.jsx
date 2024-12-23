import React, { useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { CSVLink } from "react-csv";
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
import { jsPDF } from "jspdf";
import { FaFileCsv, FaFilePdf } from "react-icons/fa6";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StatusFormFreeTrial from "./StatusFormFreeTrial";

function NewFreetrial({ newRequests, onstatuschange }) {
  const [toggle, setToggle] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [id, setid] = useState("");
  const [name, setname] = useState("");
  const [previewData, setPreviewData] = useState(null);

  const handlesubmit = (aid, aname) => {
    setToggle(true);
    setid(aid);
    setname(aname);
  };

  const handleClose = () => {
    setToggle(false);
  };

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
      accessorKey: "Handle Status",
      header: "Handle Status",
      size: 100,
      Cell: ({ row }) => (
        <Button
          sx={{ color: "#0d1b2a" }}
          onClick={() =>
            handlesubmit(
              row.original?.accessDetails.academy_id,
              row.original?.accessDetails.academy_name
            )
          }
        >
          <AccountBoxRoundedIcon />
        </Button>
      ),
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

  const csvHeaders = columns
    .filter(
      (col) =>
        col.accessorKey !== "Handle Status" && col.accessorKey !== "Preview"
    )
    .map((col) => ({
      label: col.header,
      key: col.accessorKey,
    }));

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Free Trial Records", 14, 20);

    const tableHeaders = columns
      .filter(
        (col) =>
          col.accessorKey !== "Handle Status" && col.accessorKey !== "Preview"
      )
      .map((col) => col.header);
    const tableData = newRequests.map((record) =>
      columns
        .filter(
          (col) =>
            col.accessorKey !== "Handle Status" && col.accessorKey !== "Preview"
        )
        .map((col) => record[col.accessorKey])
    );

    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 30,
      theme: "grid",
    });

    doc.save("freetrial_records.pdf");
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaFileCsv size={20} />}
          sx={{ bgcolor: "#0d1b2a" }}
        >
          <CSVLink
            data={newRequests}
            headers={csvHeaders}
            filename="freetriallist_records.csv"
            style={{ color: "white", textDecoration: "none" }}
          >
            Export CSV
          </CSVLink>
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<FaFilePdf size={20} />}
          sx={{ bgcolor: "#0d1b2a" }}
          onClick={exportToPDF}
        >
          Export PDF
        </Button>
      </Box>
      <div style={{ marginTop: "20px" }}>
        <MaterialReactTable columns={columns} data={newRequests} />
      </div>

      <StatusFormFreeTrial
        open={toggle}
        handleClose={handleClose}
        id={id}
        name={name}
        onstatuschange={onstatuschange}
      />

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

export default NewFreetrial;
