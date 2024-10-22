import React from "react";
import Navbar from "../User/Navbar";
import Footer from "./Footer";
import { PiUserCirclePlusFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { PiNotePencilBold } from "react-icons/pi";
import { FaHome } from "react-icons/fa";
import { useState } from "react";

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const academyname = sessionStorage.getItem("Academy");
  const nexturl = `/${academyname}/userprofile`;
  const navigate = useNavigate();

  const handleclick = () => {
    navigate(`/${academyname}/registrationform`);
  };

  const handlehome = () => {
    navigate(`/${academyname}`);
  };

  const handlepasswordclick = () => {
    navigate(`/${academyname}/resetcred`);
  };

  const handleemailchange = (e) => {
    setemail(e);
  };

  const handlepasswordchange = (e) => {
    setpassword(e);
  };

  const handlesubmit = async () => {
    const url = "http://localhost:5000/api/auth/userlogin";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem("accesstoken", `${data.accesstoken}`);
      sessionStorage.setItem("refreshtoken", `${data.refreshtoken}`);
      sessionStorage.setItem("Userid", `${data.user._id}`);
      sessionStorage.setItem("role", `User`);
      setemail("");
      setpassword("");
      navigate(nexturl);
    }
  };

  return (
    <>
      {/* <Navbar /> */}

      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div
          className="relative py-3 sm:max-w-xl sm:mx-auto"
          style={{ width: "500px" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl font-semibold">Login</h1>
              <div className="divide-y divide-gray-200">
                <div
                  className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
                  style={{ width: "250px" }}
                >
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="email"
                      name="email"
                      type="text"
                      value={email}
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Email address"
                      style={{ marginBottom: "20px", width: "300px" }}
                      onChange={(e) => handleemailchange(e.target.value)}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email Address
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Password"
                      style={{ marginBottom: "20px", width: "300px" }}
                      onChange={(e) => handlepasswordchange(e.target.value)}
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <button
                      className="bg-cyan-500 text-white rounded-md px-2 py-1"
                      onClick={handlesubmit}
                      style={{ marginLeft: "30px" }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Flex container to keep both buttons in one row */}
            <div className="flex justify-between mt-6">
              <button
                className="flex items-center my-2 bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={handlepasswordclick}
              >
                <PiNotePencilBold className="mr-2" size={24} />
                <span>Forgot Password</span>
              </button>

              <button
                className="flex items-center my-2 bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={handleclick}
              >
                <PiUserCirclePlusFill className="mr-2" size={24} />
                <span>Signup</span>
              </button>
            </div>

            <div className="mt-10 flex justify-center">
              <p
                style={{
                  fontFamily: "ubuntu",
                  fontSize: "15px",
                  color: "#0c4b65",
                  marginTop: "5px",
                }}
              >
                Back to Home :{" "}
              </p>
              <button
                className="bg-cyan-500 text-white rounded-md py-1 mx-2"
                onClick={handlehome}
              >
                <FaHome size={24} className="mx-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
}

export default Login;
