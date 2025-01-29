import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const [login, setLogin] = useState({ username: "", email: "", password: "" });
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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Validate email before making the API call
    if (!validateEmail(login.email)) {
      setMsg("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    const url =
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/send-otp";
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
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/verify-otp";
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
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/academylogin";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academy_username: login.username,
        academy_password: login.password,
        academy_email: login.email,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMsg("Login Successful");
      toast.success("Login successfully");
      sessionStorage.setItem("accesstoken", `${data.accesstoken}`);
      sessionStorage.setItem("refreshtoken", `${data.refreshtoken}`);
      sessionStorage.setItem("academyname", `${data.academyname}`);
      sessionStorage.setItem("academyid", `${data.academyid}`);
      sessionStorage.setItem("city", `${data.city}`);

      const academyname = await sessionStorage.getItem("academyname");
      sessionStorage.setItem("role", "Admin");

      if (academyname) {
        navigate(`/${academyname}/admin/dashboard`, {
          replace: true,
          state: { status: data.status, academyid: data.academyid },
        });
        window.location.reload();
      }
    } else {
      setMsg("Contact SuperAdmin");
      toast.error("Access Denied");
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
                "url('https://images.unsplash.com/photo-1461784121038-f088ca1e7714?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
          ></div>
          <div className="w-full p-8 lg:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-700 text-center">
              Music Academy
            </h2>
            <p className="text-xl text-gray-600 text-center">Admin</p>
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
                    Username
                  </label>
                </div>
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="text"
                  name="username"
                  onChange={inputChange}
                  value={login.username}
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

              <div className="mt-8">
                <h4>
                  {" "}
                  Don't have an account yet?{" "}
                  <span>
                    <a href="/academyregform" style={{ color: "#4b5563" }}>
                      Sign up
                    </a>
                  </span>
                  .
                </h4>
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
