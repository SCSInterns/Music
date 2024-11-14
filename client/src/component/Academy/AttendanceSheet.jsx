import React from "react";
import { MaterialReactTable } from "material-react-table";
import { CSVLink } from "react-csv";
import { Button } from "@mui/material";
import { jsPDF } from "jspdf";
import { FaFileCsv } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";

import "jspdf-autotable";

function AttendanceTable({ records }) {
  const columns = [
    {
      accessorKey: "studentid",
      header: "Student ID",
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
      <div style={{ float: "right" }}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: "10px" }}
        >
          <CSVLink
            data={records}
            headers={csvHeaders}
            filename="attendance_records.csv"
            style={{ color: "white", textDecoration: "none" }}
          >
            <FaFileCsv size={20} />
          </CSVLink>
        </Button>
        <Button variant="contained" color="secondary" onClick={exportToPDF}>
          <FaFilePdf size={20} />
        </Button>
      </div>
      <div style={{ marginTop: "80px" }}>
        <MaterialReactTable columns={columns} data={records} />
      </div>
    </>
  );
}

export default AttendanceTable;
