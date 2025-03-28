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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import { toast } from "react-toastify";
import { nextStep } from "../../../../Features/StepperSlice";
import { useDispatch, useSelector } from "react-redux";
import { Buffer } from "buffer";

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
  const formData = useSelector((state) => state.event);
  const eventid = formData.eventid;

  const ENCRYPTION_KEY = import.meta.env.VITE_AES_KEY;
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
    const hmacKey = import.meta.env.VITE_HMAC_KEY;
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

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        if (eventid === "") {
          toast.error("Please Complete Previous Step");
        }

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

        data.key = await decrypt(data.key, ENCRYPTION_KEY);
        data.id = await decrypt(data.id, ENCRYPTION_KEY);
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
  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleQrUpload = async () => {
    const data = new FormData();
    data.append("picture", qrCode);
    setLoading(true);
    const url = "http://localhost:5000/api/auth/uploadeventqrcode";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `${Token()}`,
      },
      body: data,
    });
    if (response.ok) {
      setLoading(false);
      const final = await response.json();
      seturl(final.imageUrl);
    }
    setLoading(false);
  };

  async function encrypt(text) {
    const IV_LENGTH = 16;
    const HMAC_KEY = import.meta.env.VITE_HMAC_KEY;

    if (!HMAC_KEY || !ENCRYPTION_KEY) {
      throw new Error("HMAC_KEY or ENCRYPTION_KEY is missing in .env.");
    }

    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const keyBuffer = Buffer.from(ENCRYPTION_KEY, "hex");
    const aesKey = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );

    const encodedText = new TextEncoder().encode(text);
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      encodedText
    );

    const encrypted = Buffer.from(new Uint8Array(encryptedBuffer)).toString(
      "hex"
    );

    const tag = iv;
    const hmacKeyBuffer = Buffer.from(HMAC_KEY, "hex");
    const hmacKey = await crypto.subtle.importKey(
      "raw",
      hmacKeyBuffer,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );

    const hmacBuffer = Buffer.concat([
      Buffer.from(iv),
      Buffer.from(encrypted, "hex"),
      Buffer.from(tag),
    ]);
    const hmacGeneratedBuffer = await crypto.subtle.sign(
      "HMAC",
      hmacKey,
      hmacBuffer
    );
    const hmacGenerated = [...new Uint8Array(hmacGeneratedBuffer)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return `${Buffer.from(iv).toString("hex")}:${encrypted}:${Buffer.from(
      tag
    ).toString("hex")}:${hmacGenerated}`;
  }

  console.log(url);

  const handleFinalSubmit = async () => {
    if (selectedTab === "Both" || selectedTab === "Manual") {
      if (url === "") {
        toast.error("Please Upload Qr code first ");
        return;
      }
    }

    const urli = "http://localhost:5000/api/auth/inserteventcreds";

    const did = await encrypt(credentials.id, ENCRYPTION_KEY);

    const dkey = await encrypt(credentials.key, ENCRYPTION_KEY);

    const response = await fetch(urli, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `${Token()}`,
      },
      body: JSON.stringify({
        role: sessionStorage.getItem("role"),
        id: eventid,
        rid: did,
        rkey: dkey,
        qrurl: url,
        type: selectedTab,
      }),
    });

    if (response.ok) {
      toast.success("Creds saved success");
      dispatch(nextStep());
    } else {
      toast.error("Error saving details ");
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
      <FormControl fullWidth sx={{ padding: 2 }}>
        <InputLabel>Select Payment Method</InputLabel>
        <Select
          value={selectedTab}
          onChange={(e) => setSelectedTab(e.target.value)}
        >
          <MenuItem value="Manual">Manual Payment</MenuItem>
          <MenuItem value="Razorpay">Razorpay</MenuItem>
          <MenuItem value="Both">Both</MenuItem>
        </Select>
      </FormControl>
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
            handleFinalSubmit();
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default CreatePaymentOptions;
