import React from "react";
import { MaterialReactTable } from "material-react-table";
import { CSVLink } from "react-csv";
import { Button, Box } from "@mui/material";
import { jsPDF } from "jspdf";
import { FaFileCsv } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";

import "jspdf-autotable";

function AttendanceTable({ records }) {
  console.log(records);

  const columns = [
    {
      accessorKey: "currentrollno",
      header: "Roll No",
      size: 150,
    },
    {
      accessorKey: "date",
      header: "Date",
      size: 150,
    },
    {
      accessorKey: "time",
      header: "Time",
      size: 100,
    },
    {
      accessorKey: "day",
      header: "Day",
      size: 100,
    },
  ];

  const csvHeaders = columns.map((col) => ({
    label: col.header,
    key: col.accessorKey,
  }));

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Attendance Records", 14, 20);

    const tableHeaders = columns.map((col) => col.header);
    const tableData = records.map((record) =>
      columns.map((col) => record[col.accessorKey])
    );

    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 30,
      theme: "grid",
    });

    doc.save("attendance_records.pdf");
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
            data={records}
            headers={csvHeaders}
            filename="attendance_records.csv"
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
        <MaterialReactTable columns={columns} data={records} />
      </div>
    </>
  );
}

export default AttendanceTable;
