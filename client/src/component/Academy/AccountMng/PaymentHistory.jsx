import React, { useState, useEffect } from "react";
import Token from "../../Token/Token";
import { toast } from "react-toastify";
import { Typography, MenuItem, TextField, Button, Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { jsPDF } from "jspdf";
import { FaFileCsv } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";
import { CSVLink } from "react-csv";
import "jspdf-autotable";

function PaymentDetails({ list }) {
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");
  const token = Token();
  const [selectedBatch, setSelectedBatch] = useState("");
  const [batchname, setbatchname] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [selectedstudent, setselectedstudent] = useState("");
  const [installmentdata, setInstallmentData] = useState([]);

  const handleSelectChange = (event) => setSelectedBatch(event.target.value);

  const columns = [
    {
      accessorKey: "studentname",
      header: "Name",
      size: 150,
    },
    {
      accessorKey: "paymentdate",
      header: "Date",
      size: 150,
    },
    {
      accessorKey: "transactionamount",
      header: "Amount Paid",
      size: 100,
    },
    {
      accessorKey: "paymentmode",
      header: "Mode",
      size: 100,
    },
  ];

  const handleBatchList = async () => {
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

  const fetchStudentData = () => {
    const filteredData = list.filter(
      (item) => selectedBatch === "" || item.batchname === selectedBatch
    );
    setStudentList(filteredData.map((item) => item.additionalFields.Name));
  };

  useEffect(() => {
    handleBatchList();
  }, []);

  useEffect(() => {
    fetchStudentData();
  }, [selectedBatch, list]);

  const handleSubmit = async () => {
    const url = "http://localhost:5000/api/auth/transactiondata";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname,
        role,
        studentname: selectedstudent,
        batchname: selectedBatch,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      setInstallmentData(data);
    } else {
      toast.error("Error Fetching Payment Details");
    }
  };

  const handleClear = () => {
    setSelectedBatch("");
    setselectedstudent("");
    setInstallmentData([]);
  };

  const csvDataWithAcademyName = [
    { academyname: academyname },
    ...installmentdata,
  ];

  const csvHeaders = [
    { label: "Academy Name", key: "academyname" },
    ...columns.map((col) => ({
      label: col.header,
      key: col.accessorKey,
    })),
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${academyname}-Academy`, 14, 20);
    doc.setFontSize(18);
    doc.text(`${selectedstudent} Payment Records`, 14, 40);

    const tableHeaders = columns.map((col) => col.header);
    const tableData = installmentdata.map((record) =>
      columns.map((col) => record[col.accessorKey])
    );
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 50,
      theme: "grid",
    });
    doc.save(`${selectedstudent}-payment_records.pdf`);
  };

  return (
    <>
      <div className="flex space-x-10 items-center">
        {/* Filter by Batch */}
        <div>
          <Typography align="center" gutterBottom sx={{ fontWeight: "bold" }}>
            Select Batch:
          </Typography>
          <TextField
            select
            fullWidth
            label="Select Batch"
            value={selectedBatch}
            onChange={handleSelectChange}
            sx={{ flex: 1, mt: 1, minWidth: "200px" }}
          >
            {batchname.map((batch, index) => (
              <MenuItem key={index} value={batch}>
                {batch}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {/* Select Student */}
        <div>
          <Typography align="center" gutterBottom sx={{ fontWeight: "bold" }}>
            Select Student:
          </Typography>
          <TextField
            select
            fullWidth
            label="Select Student"
            value={selectedstudent}
            disabled={selectedBatch === ""}
            onChange={(e) => setselectedstudent(e.target.value)}
            sx={{ flex: 1, mt: 1, minWidth: "200px" }}
          >
            {studentList.map((student, index) => (
              <MenuItem key={index} value={student}>
                {student}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className="mt-8">
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{ backgroundColor: "#0d1b2a" }}
          >
            Submit
          </Button>
        </div>

        <div className="mt-8">
          <Button
            variant="contained"
            onClick={() => {
              handleClear();
            }}
            style={{ backgroundColor: "#0d1b2a" }}
          >
            Reset
          </Button>
        </div>
      </div>

      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaFileCsv size={20} />}
          sx={{ bgcolor: "#0d1b2a" }}
        >
          <CSVLink
            data={csvDataWithAcademyName}
            headers={csvHeaders}
            filename={`${selectedstudent}-payment_records.csv`}
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

      <div style={{ marginTop: "50px" }}>
        <MaterialReactTable columns={columns} data={installmentdata} />
      </div>
    </>
  );
}

export default PaymentDetails;
