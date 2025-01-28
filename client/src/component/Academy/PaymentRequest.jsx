import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Button, Box } from "@mui/material";
import Token from "../Token/Token";
import "jspdf-autotable";
import { toast } from "react-toastify";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import StatusPayment from "./StatusPayment";
import Loader from "../Loader/Loader";
import { io } from "socket.io-client";

function PaymentRequest() {
  const socket = React.useRef(null);
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
  const [loading, setloading] = useState(false);

  const handlestatus = (row) => {
    console.log(row);
    settogglestatusmodal(true);
    setstatusdetails({
      name: row.original?.studentname,
      course: row.original?.course,
      id: row.original?.studentId,
      paymentdate: row.original?.paymentDate,
    });
  };

  const handleList = async () => {
    setloading(true);
    let url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/getnewpaymentrequest";
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
        setloading(false);
      }, 2000);
    } else {
      toast.error("Error fetching details");
    }
  };

  console.log(data);

  useEffect(() => {
    handleList();
  }, [academyname]);

  const startSocket = () => {
    socket.current.on("newPayment", (newEntry) => {
      setdata((prevEntries) => [newEntry, ...prevEntries]);
    });
  };
  useEffect(() => {
    socket.current = io("http://localhost:5000");
    startSocket();
    return () => {
      socket.current.off("newPayment");
      socket.current.disconnect();
    };
  }, []);

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
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255,0.9)",
            zIndex: 9999,
          }}
        >
          <>
            <Loader />
          </>
        </div>
      )}

      <div>
        <p style={{ fontSize: "20px", fontWeight: "bold" }}>
          {" "}
          Payment Review List Paid via QR code{" "}
        </p>
      </div>

      <div style={{ display: "none" }}>
        <Button variant="contained" color="primary" onClick={handlestatus}>
          Open Status Selection
        </Button>

        <StatusPayment
          open={togglestatusmodal}
          onClose={() => settogglestatusmodal(false)}
          studentData={statusdetails}
          onstatusChange={handleList}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <MaterialReactTable columns={columns} data={data} />
      </div>
    </>
  );
}

export default PaymentRequest;
