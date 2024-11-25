import React, { useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { CSVLink } from "react-csv";
import { Button, Box } from "@mui/material";
import { jsPDF } from "jspdf";
import { FaFileCsv } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";
import BatchSelectionModal from "./BatchAssignForm";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "jspdf-autotable";
import Token from "../Token/Token";
import { toast } from "react-toastify";
import ProfilePreview from "./ProfilePreview";
import StatusFormModal from "./StatusForm";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";

function ApplicantsTable({ users }) {
  const [studentid, setstudentid] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [togglestatusmodal, settogglestatusmodal] = useState(false);
  const [toggleinstallment, settoggleinstallment] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [installmentstate, setinstallmentstate] = useState({
    studentid: "",
    username: "",
  });
  const [statusdetails, setstatusdetails] = useState({
    name: "",
    course: "",
  });
  const [data, setData] = useState();

  // Function to open the modal
  const handlebatchadd = (studentid) => {
    setIsModalOpen(true);
    setstudentid(studentid);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setstudentid("");
  };

  const handletoggleclose = () => {
    setToggle(false);
    setData();
    setinstallmentstate({});
  };

  const handlestatus = (row) => {
    setstatusdetails({
      name: row.Name,
      course: row.Course,
    });
  };

  const handlePreview = async (id) => {
    const url = `http://localhost:5000/api/auth/getdatabyid/${id}`;
    let token = Token();
    let role = sessionStorage.getItem("role");

    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        setinstallmentstate({
          studentid: responseData._id,
          username: responseData.additionalFields.formdata?.Name,
        });
        toast.success("Details Fetch Success");
        setToggle(true);
        if (responseData.status === "Accept") {
          settoggleinstallment(true);
        } else {
          settoggleinstallment(false);
        }
      } else {
        toast.error("Error fetching info");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const transformedData = users.map((user) => ({
    Name: user.additionalFields?.formdata?.Name || "N/A",
    Email: user.additionalFields?.formdata?.Email || "N/A",
    "Mobile No": user.additionalFields?.formdata?.MobileNo || "N/A",
    "Starting Date": user.installementDate || "N/A",
    Course: user.additionalFields?.formdata?.Courses || "N/A",
    Batch: user.additionalFields?.formdata?.Courses || "N/A",
    "More Info": `${user.role}, ${user.status}`,
    id: user._id || "N/A",
    Status: user.status,
  }));

  console.log(transformedData);

  const columns = [
    {
      accessorKey: "Name",
      header: "Name",
      size: 200,
    },
    {
      accessorKey: "Mobile No",
      header: "Mobile No",
      size: 100,
    },
    {
      accessorKey: "Starting Date",
      header: "Starting Date",
      size: 100,
    },
    {
      accessorKey: "Course",
      header: "Course",
      size: 100,
    },
    {
      accessorKey: "Batch",
      header: "Batch",
      size: 100,
      Cell: ({ row }) => (
        <Button
          sx={{ color: "#0d1b2a" }}
          disabled={row.original?.Status !== "Accept"}
          onClick={() => handlebatchadd(row.original.id)}
        >
          <AddCircleOutlineIcon />
        </Button>
      ),
    },
    {
      accessorKey: "More Info",
      header: "More Info",
      size: 100,
      Cell: ({ row }) => (
        <Button
          sx={{ color: "#0d1b2a" }}
          disabled={row.original?.Status !== "Accept"}
          onClick={() => handlePreview(row.original.id)}
        >
          <AccountCircleIcon />
        </Button>
      ),
    },
    {
      accessorKey: "Handle Status",
      header: "Handle Status",
      size: 100,
      Cell: ({ row }) => (
        <Button
          sx={{ color: "#0d1b2a" }}
          disabled={
            row.original?.Status === "Accept" ||
            row.original?.Status === "Reject"
          }
          onClick={() => handlestatus(row)}
        >
          <AccountBoxRoundedIcon />
        </Button>
      ),
    },
  ];

  const csvHeaders = columns.map((col) => ({
    label: col.header,
    key: col.accessorKey,
  }));

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Applicants Records", 14, 20);

    const tableHeaders = columns.map((col) => col.header);
    const tableData = transformedData.map((record) =>
      columns.map((col) => record[col.accessorKey])
    );

    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 30,
      theme: "grid",
    });

    doc.save("applicants_records.pdf");
  };

  return (
    <>
      <div style={{ display: "none" }}>
        <Button variant="contained" color="primary" onClick={handlebatchadd}>
          Open Batch Selection
        </Button>

        <BatchSelectionModal
          open={isModalOpen}
          onClose={handleCloseModal}
          data={studentid}
        />
      </div>

      <div style={{ display: "none" }}>
        <Button variant="contained" color="primary" onClick={handlestatus}>
          Open Status Selection
        </Button>

        <StatusFormModal
          open={togglestatusmodal}
          onClose={() => settogglestatusmodal(false)}
          studentData={statusdetails}
        />
      </div>

      <div style={{ display: "none" }}>
        <Button variant="contained" color="primary" onClick={handlePreview}>
          Open Preview
        </Button>

        <ProfilePreview
          open={toggle}
          onClose={handletoggleclose}
          data={data}
          installmentstate={installmentstate}
        />
      </div>

      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaFileCsv size={20} />}
          sx={{ bgcolor: "#0d1b2a" }}
        >
          <CSVLink
            data={transformedData}
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

      <div className="mt-10">
        <MaterialReactTable columns={columns} data={transformedData} />
      </div>
    </>
  );
}

export default ApplicantsTable;
