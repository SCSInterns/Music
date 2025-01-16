import React, { useEffect, useState } from "react";
import Token from "../Token/Token";
import { Typography, Button, Box } from "@mui/material";
import PaymentOptions from "./PaymentOptions";

function Payment({ data }) {
  console.log(data);
  const [paymentstatsdetails, setpaymentstatsdetails] = useState({});
  const academyname = sessionStorage.getItem("Academy");
  const [togglepaymentbox, settogglepaymentbox] = useState(false);
  const [defaulttoggle, setdefaulttoggle] = useState(true);

  const paymentinfo = async (studentid) => {
    const url = "http://localhost:5000/api/auth/getpaymentstatsforusers";

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
      }),
    });
    if (response.ok) {
      const data = await response.json();
      setpaymentstatsdetails(data);

      if (data.dueamount > 0) {
        settogglepaymentbox(false);
      }
    }
  };

  const handlebox = () => {
    settogglepaymentbox(true);
    setdefaulttoggle(false);
  };

  useEffect(() => {
    paymentinfo(data._id);
  }, [data]);

  return (
    <>
      {defaulttoggle && (
        <>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              marginBottom: "30px",
              color: "#9C27B0",
              fontFamily: "ubuntu",
            }}
          >
            Payment Stats:
          </Typography>
          <div
            style={{
              flex: 1,
              fontFamily: "ubuntu",
              marginTop: "40px",
              width: "70%",
              margin: "auto",
              padding: "10px",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  {
                    label: "Previous Due",
                    value: paymentstatsdetails.previousdue,
                  },
                  {
                    label: "Current Due",
                    value: paymentstatsdetails.currentdue,
                  },
                  {
                    label: "Outstanding Amount",
                    value: paymentstatsdetails.outstandingamount,
                  },
                  {
                    label: "Joining Date",
                    value: paymentstatsdetails.installmentdate,
                  },
                  {
                    label: "Fees",
                    value: paymentstatsdetails.fees,
                  },
                ].map(({ label, value }) => (
                  <tr key={label}>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <strong>{label}</strong>
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #ddd",
                        color:
                          label === "Outstanding Amount" && value < 0
                            ? "green"
                            : label === "Outstanding Amount" && value > 0
                            ? "red"
                            : label === "Outstanding Amount" && value === 0
                            ? "gray"
                            : "inherit",
                        fontWeight:
                          label === "Outstanding Amount" ? "bold" : "normal",
                      }}
                    >
                      {label === "Outstanding Amount"
                        ? value < 0
                          ? `${Math.abs(value)} (ADV.)`
                          : value > 0
                          ? `${value} (DUE)`
                          : `${value} (CLEAR)`
                        : value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {togglepaymentbox ? (
        <Box
          sx={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #9C27B0",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <PaymentOptions data={paymentstatsdetails} />
        </Box>
      ) : (
        <>
          {paymentstatsdetails.outstandingamount > 0 ? (
            <Button
              size="large"
              variant="contained"
              onClick={() => handlebox()}
              sx={{
                backgroundColor: "#9C27B0",
                color: "white",
                marginTop: "20px",
              }}
            >
              Pay Now
            </Button>
          ) : (
            <Typography
              style={{
                margin: "20px",
                fontSize: "1rem",
                color: "#9C27B0",
                fontFamily: "ubuntu",
              }}
            >
              All your payments are clear!
            </Typography>
          )}
        </>
      )}
    </>
  );
}

export default Payment;
