import React, { useEffect, useState } from "react";
import Token from "../Token/Token";
import { Typography, Button, Box } from "@mui/material";
import PaymentOptions from "./PaymentOptions";

function Payment({ data }) {
  const [paymentstatsdetails, setpaymentstatsdetails] = useState({});
  const academyname = sessionStorage.getItem("Academy");
  const [togglepaymentbox, settogglepaymentbox] = useState(false);
  const [defaulttoggle, setdefaulttoggle] = useState(true);

  const paymentinfo = async (studentid) => {
    const url =
      "https://music-academy-e32v.onrender.com/api/auth/getpaymentstatsforusers";

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
                    label: "Advance Amount",
                    value: paymentstatsdetails.advanceamount,
                  },
                  {
                    label: "Due Amount",
                    value: paymentstatsdetails.dueamount,
                  },
                  {
                    label: "Next Installment",
                    value: paymentstatsdetails.nextpaymentdate,
                  },
                  { label: "Fees", value: paymentstatsdetails.amount },
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
                      }}
                    >
                      {value || "N/A"}
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
          {paymentstatsdetails.dueamount > 0 ? (
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
