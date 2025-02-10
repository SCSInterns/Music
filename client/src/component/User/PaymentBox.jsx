import React, { useEffect, useState } from "react";
import { Check, CreditCard } from "lucide-react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import Token from "../Token/Token";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";

export default function PaymentForm({ data }) {
  console.log(data);
  const [loading, setloading] = useState(false);
  const academyname = sessionStorage.getItem("Academy");
  const token = Token();
  const [razorid, setrazorid] = useState("");
  const rkey = razorid;

  const ENCRYPTION_KEY = process.env.REACT_APP_AES_KEY;

  async function decrypt(text, key) {
    const parts = text.split(":");
    if (parts.length !== 4) {
      throw new Error("Invalid encrypted format");
    }

    const iv = Buffer.from(parts[0], "hex");
    const encryptedData = Buffer.from(parts[1], "hex");
    const tag = Buffer.from(parts[2], "hex");
    const hmacReceived = parts[3];

    // 🔹 Compute HMAC using Buffer.concat (same as server)
    const hmacKey = process.env.REACT_APP_HMAC_KEY;
    if (!hmacKey) {
      throw new Error("HMAC key is missing in .env.");
    }

    const hmacBuffer = Buffer.concat([iv, encryptedData, tag]);

    const hmacKeyBuffer = Buffer.from(hmacKey, "hex");
    const hmacKeyCrypto = await crypto.subtle.importKey(
      "raw",
      hmacKeyBuffer,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );

    const hmacGeneratedBuffer = await crypto.subtle.sign(
      "HMAC",
      hmacKeyCrypto,
      hmacBuffer
    );
    const hmacGenerated = [...new Uint8Array(hmacGeneratedBuffer)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (hmacGenerated !== hmacReceived) {
      throw new Error("HMAC verification failed! Data might be tampered.");
    }

    // 🔹 Import AES Key
    const keyBuffer = await crypto.subtle.importKey(
      "raw",
      Buffer.from(key, "hex"),
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );

    const encryptedWithTag = new Uint8Array([
      ...new Uint8Array(encryptedData),
      ...new Uint8Array(tag),
    ]);

    var decryptedBuffer;

    try {
      decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv, tagLength: 128 },
        keyBuffer,
        encryptedWithTag
      );
    } catch (error) {
      console.error("Decryption Failed:", error);
    }

    try {
      const decryptedText = new TextDecoder().decode(decryptedBuffer);
      return decryptedText;
    } catch (error) {
      console.error("Error while decoding decrypted data:", error);
      throw error;
    }
  }

  const getrazorpayid = async (academyname) => {
    const url = "http://localhost:5000/api/auth/getrazorpayid";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const razorpayid = await decrypt(data, ENCRYPTION_KEY);
      setrazorid(razorpayid);
    } else {
      toast.error("Error Fetching Creds ");
    }
  };

  useEffect(() => {
    getrazorpayid(academyname);
  }, [academyname]);

  const generateorder = async () => {
    const url = "http://localhost:5000/api/auth/createrazorpayorder";
    setloading(true);
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentid: data.studentid,
        academyname: data.academyname,
        amount: data.outstandingamount,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      setTimeout(() => {
        setloading(false);
        handlePayment(data);
      }, 2000);
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handlePayment = async (orderdata) => {
    const options = {
      key: rkey,
      amount: orderdata.amount,
      currency: "INR",
      name: `${orderdata.academyname} Music Academy`,
      description: "Monthly Fees Payment",
      image:
        "https://i.pinimg.com/736x/f2/b9/87/f2b9874c4adae66d0dc58743d33c1130.jpg",
      order_id: orderdata.razorpayOrderId,
      handler: async function (response) {
        const verificationData = {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          studentId: data.studentid,
          academyName: data.academyname,
          mobileno: data.mobileno,
          studentName: data.studentname,
          course: data.course,
          amount: data.outstandingamount,
          enrollmentDate: data.installmentdate,
          batchname: data.batchname,
          fees: data.fees,
          email: data.studentemail,
          paymentDate: formatDate(new Date()),
          role: "Admin",
        };

        const url = "http://localhost:5000/api/auth/verifyrazorpayorder";
        setloading(true);
        const token = Token();
        const responsepayment = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verificationData: verificationData,
          }),
        });

        if (responsepayment.ok) {
          setloading(false);
          toast.success(" Payment Details Send SuccessFully ");
        } else {
          toast.error("Error Saving Payment Details ");
        }
      },
      prefill: {
        name: data.studentname,
        email: data.studentemail,
      },
      notes: {
        studentId: data.studentid,
        academyName: data.academyname,
        studentName: data.studentname,
        course: data.course,
        amount: data.amount,
        enrollmentDate: data.installmentdate,
        email: data.studentemail,
        paymentDate: formatDate(new Date()),
      },
      theme: {
        color: "#020617",
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", async function (response) {
      rzp.close();

      setTimeout(() => {
        const razorpayIframe = document.querySelector("iframe");
        const razorpayOverlay = document.querySelector(".razorpay-container");

        if (razorpayIframe) razorpayIframe.remove();
        if (razorpayOverlay) razorpayOverlay.remove();

        document.body.style.overflow = "auto";
        document.body.style.pointerEvents = "auto";
      }, 500);

      if (!response.razorpay_payment_id || !response.razorpay_signature) {
        const url = "http://localhost:5000/api/auth/failedpayment";
        const token = Token();
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentid: data.studentid,
            orderid: orderdata.razorpayOrderId,
            academyname: data.academyname,
            email: data.studentemail,
            paymentdate: formatDate(new Date()),
            amount: data.amount,
          }),
        });

        if (response.ok) {
          toast.error("Payment failed. Please try again.");
        } else {
          toast.error(" Payment Submission Failed ");
        }
        setloading(false);
        return;
      }
    });

    rzp.open();
  };

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

      <Box
        sx={{
          maxWidth: "1200px",
          margin: "auto",
          padding: "24px",
        }}
      >
        <Grid container spacing={4}>
          {/* Left Column - Payment Form */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ marginBottom: 4 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Continue Your Musical Journey
              </Typography>
              <Typography color="textSecondary">
                It's time to hit the next note! Clear your installment and stay
                on track.
              </Typography>
            </Box>

            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                size="medium"
                sx={{ marginTop: "100px" }}
                onClick={() => {
                  generateorder();
                }}
              >
                Proceed For Payment
              </Button>
            </Box>
          </Grid>

          {/* Right Column - Payment Summary */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ backgroundColor: "#f5f5f5" }}>
              <CardContent sx={{ padding: 3 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    You've to pay.
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" mt={1}>
                    ₹ {data.outstandingamount}
                  </Typography>
                </Box>

                <Box sx={{ marginTop: 4 }}>
                  {[
                    {
                      title: "Student Name : ",
                      text: `${data.studentname}`,
                    },
                    {
                      title: "Course : ",
                      text: `${data.course}`,
                    },
                    {
                      title: "Joining Date : ",
                      text: `${data.installmentdate}`,
                    },
                  ].map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        marginBottom: 3,
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#e3f2fd",
                          borderRadius: "50%",
                          padding: "4px",
                        }}
                      >
                        <Check style={{ color: "#2196f3" }} />
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography fontWeight="bold">{item.title}</Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          ml={1}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                    </Box>
                  ))}

                  <Box
                    sx={{
                      marginTop: 3,
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      padding: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Fees Reciept will be emailed within 2 business days.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
