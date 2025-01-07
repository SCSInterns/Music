import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Button, Box, TextField, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import Token from "../../Token/Token";
import { jsPDF } from "jspdf";
import { FaFileCsv } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";
import { CSVLink } from "react-csv";
import "jspdf-autotable";

function BatchTable({ records }) {
  const token = Token();
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const transformedData = records.map((user) => ({
    Name: user.additionalFields?.Name || "N/A",
    Email: user.additionalFields?.Email || "N/A",
    "Mobile Number": user.additionalFields?.MobileNo || "N/A",
    "Joining Date": user.installmentDate || "N/A",
    Course: user.additionalFields?.Courses || "N/A",
    "Total Attendance": user.attendance,
    Batchname: user.batchname || "N/A",
  }));

  const [batchname, setbatchname] = useState([]);
  const [filterdata, setfilterdata] = useState(transformedData);
  const [selectedBatch, setSelectedBatch] = useState("");

  const columns = [
    { accessorKey: "Name", header: "Name", size: 200 },
    { accessorKey: "Joining Date", header: "Joining Date", size: 100 },
    { accessorKey: "Mobile Number", header: "Mobile Number", size: 100 },
    { accessorKey: "Course", header: "Course", size: 100 },
    { accessorKey: "Email", header: "Email", size: 100 },
    { accessorKey: "Total Attendance", header: "Attendance", size: 100 },
    { accessorKey: "Batchname", header: "Batch", size: 100 },
  ];

  const handlebatchlist = async () => {
    const url = "http://localhost:5000/api/auth/ngetbatchesdetails";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyname,
          role,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const dataname = data.map((item) => item.batchname);
        setbatchname(dataname);
      } else {
        toast.error("Error Fetching Batch Names");
      }
    } catch (error) {
      toast.error("Error Fetching Batch Names");
    }
  };

  useEffect(() => {
    handlebatchlist();
  }, []);

  const handleSelectChange = (event) => {
    const batch = event.target.value;
    setSelectedBatch(batch);

    if (batch) {
      const filtered = transformedData.filter(
        (data) => data.Batchname === batch
      );
      setfilterdata(filtered);
    } else {
      setfilterdata(transformedData);
    }
  };

  const csvHeaders = columns.map((col) => ({
    label: col.header,
    key: col.accessorKey,
  }));

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Batch Records", 14, 20);

    const tableHeaders = columns.map((col) => col.header);
    const tableData = filterdata.map((record) =>
      columns.map((col) => record[col.accessorKey])
    );

    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 30,
      theme: "grid",
    });

    doc.save("batch_records.pdf");
  };

  return (
    <>
      {filterdata.length > 0 && (
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaFileCsv size={20} />}
            sx={{ bgcolor: "#0d1b2a" }}
          >
            <CSVLink
              data={filterdata}
              headers={csvHeaders}
              filename="batchrecords.csv"
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
      )}

      <Box
        sx={{
          width: 400,
          mt: 4,
          mb: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          select
          fullWidth
          label="Select Batch"
          value={selectedBatch}
          onChange={handleSelectChange}
          sx={{ flex: 1 }}
        >
          <MenuItem value="">All Batches</MenuItem>
          {batchname.map((batch, index) => (
            <MenuItem key={index} value={batch}>
              {batch}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <div style={{ marginTop: "20px" }}>
        <div className="flex justify-between items-center py-4 px-5 shadow-md">
          <p className="text-xl font-semibold text-gray-800">
            <span className="text-blue-600">{selectedBatch}</span> Student's
            List
          </p>
          <div className="flex items-center space-x-2">
            <p className="text-xl font-medium text-gray-700">
              Total Student's Count :
            </p>
            <span className="text-xl font-extrabold text-green-600">
              {filterdata.length}
            </span>
          </div>
        </div>

        <MaterialReactTable columns={columns} data={filterdata} />
      </div>
    </>
  );
}

export default BatchTable;
