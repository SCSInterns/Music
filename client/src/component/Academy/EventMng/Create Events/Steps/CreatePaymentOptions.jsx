import React, { useState, useEffect } from "react";
import Token from "../../../../Token/Token";
import {
  Tooltip,
  Button,
  Tabs,
  Tab,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import { toast } from "react-toastify";
import { nextStep } from "../../../../Features/StepperSlice";
import { useDispatch } from "react-redux";

function CreatePaymentOptions() {
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Manual");
  const [qrCode, setQrCode] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [url, seturl] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/getacademyrazorpaycreds",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `${Token()}`,
            },
            body: JSON.stringify({
              academyname: sessionStorage.getItem("academyname"),
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch credentials");
        }
        const data = await response.json();
        setCredentials(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  const handleQrChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setQrCode(file);
      setQrPreview(URL.createObjectURL(file));
    }
  };

  // https://res.cloudinary.com/dipnrfd3h/image/upload/v1738735682/EventQrcode/download%20%282%29.png

  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    const url = "http://localhost:5000/api/auth/uploadeventcreds";
    const token = Token();

    if (!token) {
      toast.error("Authorization token is missing.");
      return;
    }

    const data = new FormData();

    if (qrCode && (selectedTab === "Manual" || selectedTab === "Both")) {
      data.append("picture", qrCode);
    }

    if (selectedTab === "Razorpay" || selectedTab === "Both") {
      if (!credentials.id || !credentials.key) {
        toast.error("Razorpay credentials are required.");
        return;
      }
      data.append("razorpayid", credentials.id);
      data.append("razorpaykey", credentials.key);
    }

    data.append("academyId", sessionStorage.getItem("academyid"));
    data.append("eventId", "123");
    data.append("type", selectedTab);
    // ✅ Log FormData properly
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]); // Logs key and value
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          authorization: `${token}`,
        },
        body: data,
      });

      const final = await response.json();

      if (response.ok) {
        toast.success(final.message);
        setQrCode(null);
        setQrPreview(null);
        setSelectedTab("Manual");
        dispatch(nextStep());
      } else {
        toast.error(final.error || "Failed to upload credentials.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  const handleQrUpload = async () => {
    const data = new FormData();
    data.append("picture", qrCode);

    const url = "http://localhost:5000/api/auth/uploadeventqrcode";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `${Token()}`,
      },
      body: data,
    });
    if (response.ok) {
      const final = await response.json();
      seturl(final.imageUrl);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border animate-spin border-4 border-t-4 border-blue-500 w-16 h-16 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 my-4 ">
      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        sx={{ padding: 2 }}
      >
        <Tab label="Manual Payment" value={"Manual"} />
        <Tab label="Razorpay" value={"Razorpay"} />
        <Tab label="Both" value={"Both"} />
      </Tabs>

      <div className="mt-6">
        {selectedTab === 0 && (
          <div className="my-16 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Add The Payment QR Code here:
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleQrChange}
              className="my-8"
            />
            {qrPreview && (
              <>
                <Button
                  onClick={() => {
                    setQrCode(null);
                    setQrPreview(null);
                  }}
                >
                  <DeleteIcon sx={{ color: "red" }} />
                </Button>
                <img
                  src={qrPreview}
                  alt="QR Code Preview"
                  className="mt-4 w-48 h-48 mx-auto border border-gray-300 rounded-md"
                />
              </>
            )}
          </div>
        )}

        {(selectedTab === "Razorpay" || selectedTab === "Both") &&
          credentials && (
            <div>
              <div className="my-16">
                <h2 className="text-xl font-semibold text-gray-800 text-center">
                  Razorpay Credentials:
                </h2>
                <Tooltip title={editMode ? "Lock Changes" : "Edit Credentials"}>
                  <Button
                    variant="outlined"
                    className="float-right my-4 mr-4 hover:bg-blue-500 hover:text-blue-600"
                    onClick={toggleEdit}
                  >
                    {editMode ? <LockIcon /> : <CreateIcon />}
                  </Button>
                </Tooltip>
              </div>
              <form className="space-y-6">
                <div className="flex items-center space-x-4">
                  <label className="w-1/3 text-lg font-medium text-gray-700">
                    Razorpay Key ID:
                  </label>
                  <TextField
                    type="text"
                    value={credentials.id}
                    onChange={(e) =>
                      setCredentials({ ...credentials, id: e.target.value })
                    }
                    disabled={!editMode}
                    className="w-2/3"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-1/3 text-lg font-medium text-gray-700">
                    Razorpay Key Secret:
                  </label>
                  <div className="w-2/3 relative">
                    <TextField
                      type={showPassword ? "text" : "password"}
                      value={credentials.key}
                      onChange={(e) =>
                        setCredentials({ ...credentials, key: e.target.value })
                      }
                      disabled={!editMode}
                      className="w-full"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility}>
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

        {(selectedTab === "Manual" || selectedTab === "Both") && (
          <div className="my-16 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Add The Payment QR Code here:
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleQrChange}
              className="my-8"
            />
            {qrPreview && (
              <>
                <Button
                  onClick={() => {
                    setQrCode(null);
                    setQrPreview(null);
                  }}
                >
                  <DeleteIcon sx={{ color: "red" }} />
                </Button>
                <img
                  src={qrPreview}
                  alt="QR Code Preview"
                  className="mt-4 w-48 h-48 mx-auto border border-gray-300 rounded-md"
                />
                <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 3 }}
                  onClick={handleQrUpload}
                >
                  {" "}
                  Uplaod{" "}
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div>
        <Button
          variant="contained"
          sx={{ my: 3, float: "right" }}
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default CreatePaymentOptions;
