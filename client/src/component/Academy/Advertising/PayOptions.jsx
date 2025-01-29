import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import Token from "../../Token/Token";
import { toast } from "react-toastify";

const PaymentDialog = ({ open, onClose, data, onUpdate }) => {
  const token = Token();
  const academyname = sessionStorage.getItem("academyname");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const academyid = sessionStorage.getItem("academyid");
  const role = sessionStorage.getItem("role");
  const city = sessionStorage.getItem("city");
  const [loading, setloading] = useState(false);

  const handleOptionClick = async (option) => {
    console.log(option);
    if (option === "payLater") {
      const url =
        "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/paylateradvertise";

      const createbooking = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: role,
          academyid: academyid,
          advertiseid: data._id,
          academycity: city,
          amount: data.price,
          advertisename: data.name,
          section: data.section,
        }),
      });
      const result = await createbooking.json();
      const msg = result.message;

      if (createbooking.ok) {
        toast.success(msg);
        onClose();
      } else {
        toast.error(msg);
      }
    }

    if (option === "payNow") {
      // razorpaypayment
      const generateorder = async () => {
        const url =
          "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/createrazorpayorderadv";
        setloading(true);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
          body: JSON.stringify({
            amount: data.price,
            advertiseid: data._id,
            academyname: academyname,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          setTimeout(() => {
            setloading(false);
            handlePayment(data);
            onUpdate();
          }, 2000);
          toast.success("Order Created Succes");
        }
      };

      await generateorder();
      setIsPopupOpen(true);

      const rkey = "rzp_test_ABJbNmzawvCqjV";

      const handlePayment = async (orderdata) => {
        const options = {
          key: rkey,
          amount: orderdata.amount,
          currency: "INR",
          name: `SoftCoding Solutions`,
          description: "Advertise Payment",
          image:
            "https://i.pinimg.com/736x/f2/b9/87/f2b9874c4adae66d0dc58743d33c1130.jpg",
          order_id: orderdata.razorpayOrderId,
          handler: async function (response) {
            const verificationData = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              advertiseid: orderdata.adminId,
              academyid: academyid,
              amount: orderdata.amount,
              advertisename: data.name,
              section: data.section,
            };

            const url =
              "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/verifyrazorpayorderadv";
            setloading(true);
            const responsepayment = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `${token}`,
              },
              body: JSON.stringify({
                verificationData: verificationData,
              }),
            });

            if (responsepayment.ok) {
              setIsPopupOpen(false);
              setloading(false);
              toast.success(" Payment Success . Access from Active Plans 🎉.");
            } else {
              setIsPopupOpen(false);
              setloading(false);
              toast.error("Error Saving Payment Details ");
            }
          },
          prefill: {
            name: orderdata.academyname,
          },
          notes: {
            adminid: orderdata.adminId,
            academyName: orderdata.academyname,
            amount: orderdata.amount,
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
            const razorpayOverlay = document.querySelector(
              ".razorpay-container"
            );

            if (razorpayIframe) razorpayIframe.remove();
            if (razorpayOverlay) razorpayOverlay.remove();

            document.body.style.overflow = "auto";
            document.body.style.pointerEvents = "auto";
          }, 500);

          if (!response.razorpay_payment_id || !response.razorpay_signature) {
            const url =
              "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/failedadvpayment";
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `${token}`,
              },
              body: JSON.stringify({
                adminid: orderdata.adminId,
                orderId: orderdata.razorpayOrderId,
                academyname: orderdata.academyname,
              }),
            });

            if (response.ok) {
              toast.error("Payment failed. Please try again.");
            } else {
              toast.error(" Payment Submission Failed ");
            }
            setIsPopupOpen(false);
            setloading(false);
            return;
          }
        });

        rzp.open();
      };
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Choose Payment Option</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Please select your preferred payment option:
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOptionClick("payNow")}
        >
          Pay Now
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleOptionClick("payLater")}
        >
          Pay Later
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
