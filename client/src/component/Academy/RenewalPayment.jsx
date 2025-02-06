import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { Typography } from "@mui/material";

export default function PricingDetails({ id, admin }) {
  const [button, setButton] = useState(false);
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: "Advance",
      price: "₹ 4000 ",
      description: "Perfect for your musical journey",
      features: [
        "Student Hub",
        "Pay Wise",
        "Class Flow",
        "Website Pilot",
        "Attendance Ease",
        "White Labeling",
      ],
    },
  ];

  console.log(admin);
  console.log(admin.renewaldate);

  useEffect(() => {
    if (admin.renewaldate !== "N/A" && admin.renewaldate !== null) {
      const validdate = admin.renewaldate || "N/A";
      const [day, month, year] = validdate.split("-");
      const renewalDate = new Date(`${month}-${day}-${year}`);

      const currentDate = new Date();

      if (currentDate >= renewalDate) {
        setButton(true);
      } else {
        setButton(false);
      }
    } else {
      setButton(false);
    }
  }, [admin.renewaldate]);

  const generateOrder = async () => {
    const url = "http://localhost:5000/api/auth/handlesubscriptionpayment";
    setLoading(true);

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
        setLoading(false);
        handlePayment(data);
      }, 2000);

      toast.success("Order Created Successfully");
    }
  };

  const rkey = process.env.REACT_APP_RKEY;

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
          adminId: id,
        };

        const url = "http://localhost:5000/api/auth/verifysubscriptionpayment";
        setLoading(true);
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
          setLoading(false);
          toast.success(
            "Payment Paid Successfully 🎉. Please login again to access your account."
          );
        } else {
          setLoading(false);
          toast.error("Payment Failed. Please try again.");
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
        const url = "http://localhost:5000/api/auth/failedsubscriptionpayment";
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
          toast.error("Payment Submission Failed");
        }
        setLoading(false);
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
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            zIndex: 9999,
          }}
        >
          <Loader />
        </div>
      )}

      <div className="max-w-5xl mx-auto p-8 py-10">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
          Renew today, stay unstoppable! 🎉
        </h2>
        <div className="flex flex-col md:flex-row gap-12 bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Left Column - Pricing and CTA */}
          <div className="flex-1 p-8 space-y-8 border-r border-gray-200 bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-800">
              {plans[0].name}
            </h1>
            <div className="flex items-baseline space-x-1 justify-center">
              <span className="text-4xl font-bold text-green-600 lg:ml-10">
                {plans[0].price}
              </span>
              <span className="text-sm text-gray-500">/ year</span>
            </div>
            <p className="text-gray-700 text-center mb-6">
              {plans[0].description}
            </p>
            {!button ? (
              <Typography className="text-green-600">
                Your subscription is active. 😊
              </Typography>
            ) : (
              <button
                className="px-6 py-2 rounded-full bg-black text-white hover:bg-black/90 transition-colors shadow-lg transform hover:scale-105"
                onClick={generateOrder}
                disabled={!button}
              >
                Pay Now
              </button>
            )}
          </div>

          {/* Right Column - Features */}
          <div className="flex-1 p-8 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-5 text-gray-800">
                Features
              </h2>
              <ul className="space-y-4">
                {plans[0].features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
