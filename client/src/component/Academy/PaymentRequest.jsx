import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Button, Box } from "@mui/material";
import Token from "../Token/Token";
import "jspdf-autotable";
import { toast } from "react-toastify";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import StatusPayment from "./StatusPayment";

function PaymentRequest() {
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");
  const token = Token();
  const [data, setdata] = useState([]);
  const [togglestatusmodal, settogglestatusmodal] = useState(false);
  const [statusdetails, setstatusdetails] = useState({
    name: "",
    course: "",
    id: "",
    paymentdate: "",
  });

  const handlestatus = (row) => {
    settogglestatusmodal(true);
    setstatusdetails({
      name: row.original?.studentname,
      course: row.original?.Course,
      id: row.original?.studentId,
      paymentdate: row.original?.paymentDate,
    });
  };

  const handleList = async () => {
    let url = "http://localhost:5000/api/auth/getnewpaymentrequest";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
      }),
    });

    const data = await response.json();
    if (Array.isArray(data)) {
      setTimeout(() => {
        setdata(data);
      }, 2000);
    } else {
      toast.error("Error fetching details");
    }
  };

  console.log(data);

  useEffect(() => {
    handleList();
  }, [academyname]);

  const columns = [
    {
      accessorKey: "TransactionId",
      header: "TransactionId",
      size: 150,
    },
    {
      accessorKey: "studentname",
      header: "studentname",
      size: 150,
    },
    {
      accessorKey: "amount",
      header: "amount",
      size: 150,
    },
    {
      accessorKey: "course",
      header: "course",
      size: 100,
    },
    {
      accessorKey: "paymentDate",
      header: "paymentDate",
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
  ];

  return (
    <>
      <div>
        <p style={{ fontSize: "20px", fontWeight: "bold" }}>
          {" "}
          Payment Review List{" "}
        </p>
      </div>

      <div style={{ display: "none" }}>
        <Button variant="contained" color="primary" onClick={handlestatus}>
          Open Status Selection
        </Button>

        {/* <StatusPayment
          open={togglestatusmodal}
          onClose={() => settogglestatusmodal(false)}
          //   studentData={statusdetails}
          //   onstatusChange={handleapplicantslist}
        /> */}
      </div>
      <div style={{ marginTop: "20px" }}>
        <MaterialReactTable columns={columns} data={data} />
      </div>
    </>
  );
}

export default PaymentRequest;
