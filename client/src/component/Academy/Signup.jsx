import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import LooksTwoOutlinedIcon from "@mui/icons-material/LooksTwoOutlined";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4OutlinedIcon from "@mui/icons-material/Looks4Outlined";

function Signup() {
  const [signup, setsignup] = useState({
    academy_name: "",
    academy_email: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [msg, setmsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const inputChange = (e) => {
    const { name, value } = e.target;
    setsignup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setacademyname = async () => {
    const url = `https://music-academy-e32v.onrender.com/api/auth/preview/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setsignup({ academy_name: data.academy_name });
  };

  useEffect(() => {
    setacademyname();
  }, [id]);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!/\S+@\S+\.\S+/.test(signup.academy_email)) {
      setmsg("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      if (!otpSent) {
        // Send OTP to the provided email
        const response = await fetch(
          "https://music-academy-e32v.onrender.com/api/auth/send-otp",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: signup.academy_email,
            }),
          }
        );

        const textResponse = await response.text();
        if (response.ok) {
          setOtpSent(true);
          toast.success("OTP sent to your email.");
        } else {
          setmsg("Failed to send OTP.");
          toast.error("Failed to send OTP.");
        }
      } else if (!otpVerified) {
        // Verify OTP
        const response = await fetch(
          "https://music-academy-e32v.onrender.com/api/auth/verify-otp",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: signup.academy_email,
              otp: otp,
            }),
          }
        );

        const textResponse = await response.text();
        if (response.ok) {
          setOtpVerified(true);
          toast.success("OTP verified. Completing signup...");

          // Complete signup
          const signupResponse = await fetch(
            "https://music-academy-e32v.onrender.com/api/auth/academysignup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                academy_name: signup.academy_name,
                academy_email: signup.academy_email,
              }),
            }
          );

          if (signupResponse.ok) {
            toast.success("Signup Successful");
            const data = await signupResponse.json();
            sessionStorage.setItem("academyname", data.academy_name);
            navigate(`/subscriptionpayment/${id}`);
          } else {
            setmsg("Signup failed.");
            toast.error("Signup failed.");
          }
        } else {
          setmsg("Invalid OTP.");
          toast.error("Invalid OTP.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setmsg("An error occurred.");
      toast.error("An error occurred.");
    }
  };

  return (
    <div>
      <div className="py-16">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
          <div
            className="hidden lg:block lg:w-1/2 bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
          ></div>
          <div className="w-full p-8 lg:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-700 text-center">
              Music Academy
            </h2>
            <p className="text-xl text-gray-600 text-center">
              Academy Signup Request
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
                <Looks3Icon fontSize="large" />
              </p>
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <p className="text-xs text-center text-gray-500 uppercase">
                <Looks4OutlinedIcon fontSize="large" />
              </p>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>

            {!otpSent && (
              <>
                <div className="mt-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    style={{ textAlign: "left" }}
                  >
                    Academy Name
                  </label>
                  <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                    type="text"
                    name="academy_name"
                    value={signup.academy_name}
                    onChange={inputChange}
                    InputProps={{
                      readOnly: true,
                    }}
                    readOnly
                  />
                </div>

                <div className="mt-4">
                  <div className="flex justify-between">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Email
                    </label>
                  </div>
                  <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                    type="email"
                    name="academy_email"
                    value={signup.academy_email}
                    onChange={inputChange}
                  />
                </div>
              </>
            )}

            {otpSent && !otpVerified && (
              <div className="mt-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  style={{ textAlign: "left" }}
                >
                  Enter OTP
                </label>
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}

            <div className="mt-8">
              <button
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                onClick={handleSignup}
              >
                {otpSent && !otpVerified ? "Verify OTP" : "Send Request"}
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              {msg && <p className="text-red-500 text-center">{msg}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
