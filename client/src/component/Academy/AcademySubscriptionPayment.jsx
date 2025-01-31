import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Looks4Icon from "@mui/icons-material/Looks4";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import LooksTwoOutlinedIcon from "@mui/icons-material/LooksTwoOutlined";
import Looks3OutlinedIcon from "@mui/icons-material/Looks3Outlined";
import Looks4OutlinedIcon from "@mui/icons-material/Looks4Outlined";
import Looks5Icon from "@mui/icons-material/Looks5";
import Loader from "../Loader/Loader";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";

function AcademySubscriptionPayment() {
  const { id } = useParams();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [freetrialpopup, setfreetrialpopup] = useState(false);
  const [paymentOption, setPaymentOption] = useState("");
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();
  const academyname = sessionStorage.getItem("academyname");

  const handlePaymentOptionChange = (e) => {
    const selectedOption = e.target.value;
    setPaymentOption(selectedOption);

    if (selectedOption === "payNow") {
      setIsPopupOpen(true);
    }

    if (selectedOption === "freetrial") {
      setfreetrialpopup(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleFreeClosePopup = () => {
    setfreetrialpopup(false);
  };

  const submitfreetrial = async (academyname) => {
    const url =
      "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/freetrialrequest";
    setloading(true);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
      }),
    });

    if (response.ok) {
      toast.success(
        "Free Trial Request Submitted . Please click submit to proceed "
      );
      setfreetrialpopup(false);
      setloading(false);
    } else {
      setfreetrialpopup(false);
      toast.error("Kindly try again later");
    }
  };

  const handlesubmit = () => {
    if (paymentOption === "") {
      toast.error("Please select one option");
      return;
    }

    navigate("/admin/login");
  };
  const generateorder = async () => {
    const url =
      "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/handlesubscriptionpayment";
    setloading(true);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentoption: "Pay Now",
        amount: 4000,
        adminid: id,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      setTimeout(() => {
        setloading(false);
        handlePayment(data);
      }, 2000);

      toast.success("Order Created Succes");
    }
  };

  const rkey = "rzp_test_ABJbNmzawvCqjV";

  const handlePayment = async (orderdata) => {
    const options = {
      key: rkey,
      amount: orderdata.amount,
      currency: "INR",
      name: `SoftCoding Solutions`,
      description: "Subscription Payment",
      image:
        "https://i.pinimg.com/736x/f2/b9/87/f2b9874c4adae66d0dc58743d33c1130.jpg",
      order_id: orderdata.razorpayOrderId,
      handler: async function (response) {
        const verificationData = {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          adminId: orderdata.adminId,
        };

        const url =
          "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/verifysubscriptionpayment";
        setloading(true);
        const responsepayment = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verificationData: verificationData,
          }),
        });

        if (responsepayment.ok) {
          setIsPopupOpen(false);
          setloading(false);
          toast.success(" Payment Success . Pls submit your application 🎉.");
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
        const razorpayOverlay = document.querySelector(".razorpay-container");

        if (razorpayIframe) razorpayIframe.remove();
        if (razorpayOverlay) razorpayOverlay.remove();

        document.body.style.overflow = "auto";
        document.body.style.pointerEvents = "auto";
      }, 500);

      if (!response.razorpay_payment_id || !response.razorpay_signature) {
        const url =
          "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/failedsubscriptionpayment";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
        <div className="py-16">
          <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
            <div
              className="hidden lg:block lg:w-1/2 bg-cover"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              }}
            ></div>
            <div className="w-full p-8 lg:w-1/2 mt-5 h-96">
              <h2 className="text-2xl font-semibold text-gray-700 text-center">
                Music Academy
              </h2>
              <p className="text-xl text-gray-600 text-center">
                Academy Subscription Payment
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="border-b w-1/5 lg:w-1/4"></span>
                <p className="text-xs text-center text-gray-500 uppercase">
                  <LooksOneOutlinedIcon fontSize="large" />
                </p>
                <span className="border-b w-1/5 lg:w-1/4"></span>
                <p className="text-xs text-center text-gray-500 uppercase">
                  <LooksTwoOutlinedIcon fontSize="large" />
                </p>
                <span className="border-b w-1/5 lg:w-1/4"></span>
                <p className="text-xs text-center text-gray-500 uppercase">
                  <Looks3OutlinedIcon fontSize="large" />
                </p>
                <span className="border-b w-1/5 lg:w-1/4"></span>
                <p className="text-xs text-center text-gray-500 uppercase">
                  <Looks4OutlinedIcon fontSize="large" />
                </p>
                <span className="border-b w-1/5 lg:w-1/4"></span>
                <p className="text-xs text-center text-gray-500 uppercase">
                  <Looks5Icon fontSize="large" />
                </p>
                <span className="border-b w-1/5 lg:w-1/4"></span>
              </div>

              <div className="mt-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  style={{ textAlign: "left" }}
                >
                  Payment Options
                </label>
                <div className="bg-gray-200 p-4 rounded-lg mt-7">
                  <RadioGroup
                    value={paymentOption}
                    onChange={handlePaymentOptionChange}
                    className="flex flex-row items-center"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                      flexDirection: "row",
                    }}
                  >
                    <FormControlLabel
                      value="payNow"
                      control={<Radio />}
                      label="Pay Now"
                    />
                    <FormControlLabel
                      value="payLater"
                      control={<Radio />}
                      label="Pay Later"
                    />
                    <FormControlLabel
                      value="freetrial"
                      control={<Radio />}
                      label="Free Trial"
                    />
                  </RadioGroup>
                </div>
              </div>

              <div className="mt-6">
                <button
                  className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                  onClick={(e) => handlesubmit(e)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={isPopupOpen} onClose={handleClosePopup}>
          <DialogTitle>Pay Now</DialogTitle>
          <DialogContent>
            <p>Please proceed with your payment details.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePopup}>Cancel</Button>
            <Button onClick={() => generateorder()}>Proceed</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={freetrialpopup} onClose={handleFreeClosePopup}>
          <DialogTitle>Free Trial</DialogTitle>
          <DialogContent>
            <p>You Will Get Seven Days of Free Trail.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFreeClosePopup}>Cancel</Button>
            <Button onClick={() => submitfreetrial(academyname)}>
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default AcademySubscriptionPayment;
