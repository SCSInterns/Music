import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const [login, setLogin] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    setLogin((prevLogin) => ({
      ...prevLogin,
      [name]: value,
    }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Email validation
    if (!/\S+@\S+\.\S+/.test(login.email)) {
      setMsg("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/send-otp";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: login.email,
      }),
    });

    if (response.status === 200) {
      setMsg("OTP sent successfully");
      setOtpSent(true);
      toast.success("OTP sent successfully");
    } else {
      const errorText = await response.text();
      setMsg(`Error sending OTP: ${errorText}`);
      toast.error(`Error sending OTP: ${errorText}`);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/verify-otp";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: login.email,
        otp,
      }),
    });

    if (response.status === 200) {
      setMsg("OTP verified successfully");
      toast.success("OTP verified successfully");
      await handleLogin(e);
    } else {
      setMsg("Invalid OTP");
      toast.error("Invalid OTP");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/superadmin/superadminlogin";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: login.email,
        password: login.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMsg("Login Successful");
      toast.success("Login successfully");
      sessionStorage.setItem("accesstoken", `${data.accesstoken}`);
      sessionStorage.setItem("refreshtoken", `${data.refreshtoken}`);
      sessionStorage.setItem("name", `${data.name}`);
      sessionStorage.setItem("role", "Superadmin");

      const role = await sessionStorage.getItem("role");

      if (role) {
        navigate(`/superadmin/dashboard`, {
          replace: true,
        });
        window.location.reload();
      }
    } else {
      setMsg("Invalid credentials");
      toast.error("Invalid credentials");
    }
  };

  const onOtpChange = (e) => {
    setOtp(e.target.value);
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
            <p className="text-xl text-gray-600 text-center">Super Admin</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <a
                href="#"
                className="text-xs text-center text-gray-500 uppercase"
              >
                login
              </a>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
              <div className="mt-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  style={{ textAlign: "left" }}
                >
                  Email Address
                </label>
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="email"
                  name="email"
                  onChange={inputChange}
                  value={login.email}
                />
              </div>
              <div className="mt-4">
                <div className="flex justify-between">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                </div>
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="password"
                  name="password"
                  onChange={inputChange}
                  value={login.password}
                />
              </div>
              {otpSent && (
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    OTP
                  </label>
                  <input
                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                    type="text"
                    name="otp"
                    onChange={onOtpChange}
                    value={otp}
                  />
                </div>
              )}
              <div className="mt-8">
                <button
                  className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                  type="submit"
                >
                  {otpSent ? "Verify OTP" : "Send OTP"}
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between"></div>
            </form>
            <p className="text-red-500 text-center mt-4">{msg}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
