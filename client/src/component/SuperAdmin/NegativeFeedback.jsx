import React from "react";
import { MaterialReactTable } from "material-react-table";
import { CSVLink } from "react-csv";
import { Button, Box } from "@mui/material";
import { jsPDF } from "jspdf";
import { FaFileCsv } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";

function PositiveFeedback({ inquiryData }) {
  const columns = [
    {
      accessorKey: "academyname",
      header: "Academy Name",
      size: 100,
      muiTableHeadCellProps: {
        sx: { backgroundColor: "#2e639c", color: "#fff" },
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 100,
      muiTableHeadCellProps: {
        sx: { backgroundColor: "#2e639c", color: "#fff" },
      },
    },
    {
      accessorKey: "mobileno",
      header: "Mobile No ",
      size: 100,
      muiTableHeadCellProps: {
        sx: { backgroundColor: "#2e639c", color: "#fff" },
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 150,
      muiTableHeadCellProps: {
        sx: { backgroundColor: "#2e639c", color: "#fff" },
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      size: 100,
      muiTableHeadCellProps: {
        sx: { backgroundColor: "#2e639c", color: "#fff" },
      },
    },
    {
      accessorKey: "city",
      header: "City",
      size: 100,
      muiTableHeadCellProps: {
        sx: { backgroundColor: "#2e639c", color: "#fff" },
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      muiTableHeadCellProps: {
        sx: { backgroundColor: "#2e639c", color: "#fff" },
      },
    },
  ];

  const csvHeaders = columns.map((col) => ({
    label: col.header,
    key: col.accessorKey,
  }));

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Positive Feedback Records", 14, 20);

    const tableHeaders = columns.map((col) => col.header);
    const tableData = inquiryData.map((record) =>
      columns.map((col) => record[col.accessorKey])
    );
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 30,
      theme: "grid",
    });
    doc.save("negativefeedback_records.pdf");
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
            data={inquiryData}
            headers={csvHeaders}
            filename="negativefeedback_records.csv"
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
        <MaterialReactTable columns={columns} data={inquiryData} />
      </div>
    </>
  );
}

export default PositiveFeedback;
