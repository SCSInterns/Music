import React, { useState, useEffect } from "react";
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
import PreviewIcon from "@mui/icons-material/Preview";
import { Edit } from "@mui/icons-material";

function ApplicantsTable({ users, handleapplicantslist }) {
  const [studentid, setstudentid] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [togglestatusmodal, settogglestatusmodal] = useState(false);
  const [toggleinstallment, settoggleinstallment] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [recordsheet, setrecordsheet] = useState([]);
  const [paymentstatsdetails, setpaymentstatsdetails] = useState({});
  const [installmentstate, setinstallmentstate] = useState({
    studentid: "",
    username: "",
  });
  const [batchdata, setbatchdata] = useState({});
  const [statusdetails, setstatusdetails] = useState({
    name: "",
    course: "",
    id: "",
    email: "",
  });
  const [data, setData] = useState();
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

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
    setinstallmentstate({
      studentid: "",
      username: "",
    });
    setpaymentstatsdetails({});
    setbatchdata({});
    setrecordsheet([]);
    setinstallmentstate({});
  };

  const handlestatus = (row) => {
    settogglestatusmodal(true);
    setstatusdetails({
      name: row.original?.Name,
      course: row.original?.Course,
      id: row.original?.id,
      email: row.original?.Email,
    });
  };

  const updatepaymnetstats = async (data) => {
    console.log(data);
    paymentstatsdetails.nextpaymentdate = data.nextpaymentdate;
    paymentstatsdetails.advanceamount = data.advanceamount;
    paymentstatsdetails.dueamount = data.dueamount;
  };

  console.log(paymentstatsdetails);

  const paymentstats = async (studentid) => {
    const url = "http://localhost:5000/api/auth/fetchparticularaccount";

    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentid: studentid,
        academyname: academyname,
        role: role,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      setpaymentstatsdetails(data[0]);
    }
  };

  const batchdetails = async (id) => {
    console.log("Student Id :", id);
    const url = "http://localhost:5000/api/auth/getbatchdetail";
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentid: id,
        academyname: academyname,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      setbatchdata(data);
    }
  };

  const handleattendancerecord = async () => {
    const url = "http://localhost:5000/api/auth/getrecords";
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
        studentid: data._id,
        batchid: batchdata._id,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      setrecordsheet(data);
    }
  };

  useEffect(() => {
    if (data && batchdata) {
      handleattendancerecord();
    }
  }, [data && batchdata]);

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
        paymentstats(id);
        batchdetails(id);
        setinstallmentstate({
          studentid: responseData._id,
          username: responseData.additionalFields.formdata?.Name,
        });
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
    Name: user.additionalFields?.Name || "N/A",
    Email: user.additionalFields?.Email || "N/A",
    "Mobile No": user.additionalFields?.MobileNo || "N/A",
    "Starting Date": user.installmentDate || "N/A",
    Course: user.additionalFields?.Courses || "N/A",
    Batch: user.batchname || "N/A",
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
      accessorKey: "Handle Status",
      header: "Handle Status",
      size: 100,
      Cell: ({ row }) => (
        <Button sx={{ color: "#0d1b2a" }} onClick={() => handlestatus(row)}>
          <AccountBoxRoundedIcon />
        </Button>
      ),
    },
    {
      accessorKey: "Batch",
      header: "Batch",
      size: 100,
      Cell: ({ row }) =>
        row.original?.Batch === "N/A" ? (
          <Button
            sx={{ color: "#0d1b2a" }}
            disabled={row.original?.Status !== "Accept"}
            onClick={() => handlebatchadd(row.original.id)}
          >
            <AddCircleOutlineIcon />
          </Button>
        ) : (
          <Button
            sx={{ color: "#0d1b2a" }}
            disabled={row.original?.Status !== "Accept"}
            onClick={() => handlebatchadd(row.original.id)}
          >
            <Edit />
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
          <PreviewIcon />
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
          onstatusChange={handleapplicantslist}
        />
      </div>

      <div style={{ display: "none" }}>
        <Button variant="contained" color="primary" onClick={handlePreview}>
          Open Preview
        </Button>

        <ProfilePreview
          key={paymentstats}
          open={toggle}
          onClose={handletoggleclose}
          data={data}
          installmentstate={installmentstate}
          paymentstats={paymentstatsdetails}
          batchdetails={batchdata}
          recordsheet={recordsheet}
          updatepaymentstats={updatepaymnetstats}
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
            filename="applicants_records.csv"
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
