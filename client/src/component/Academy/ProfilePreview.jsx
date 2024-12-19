import React, { useState, useEffect } from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import PortraitIcon from "@mui/icons-material/Portrait";
import PaymentDetails from "./PaymentDetails";
import BatchProfile from "./BatchProfile";
import AttendanceManagement from "./AttendanceManagement";
import AttendanceSheet from "./AttendanceSheet";
import PaymentBox from "./PaymentBox";
import CloseIcon from "@mui/icons-material/Close";

function ProfilePreview({
  open,
  onClose,
  data,
  installmentstate,
  paymentstats,
  batchdetails,
  recordsheet,
  updatepaymentstats,
}) {
  const [activeTab, setActiveTab] = useState("Add Payment");

  console.log(updatepaymentstats);

  const switchToPaymentHistory = () => {
    setActiveTab("Payment History");
  };

  const menuItems = [
    {
      name: "Add Payment",
      key: "Add Payment",
      component: (
        <PaymentBox
          data={data}
          paymentstatsdetails={paymentstats}
          updatepaymentstats={updatepaymentstats}
          switchToPaymentHistory={switchToPaymentHistory}
        />
      ),
    },
    {
      name: "Payment History",
      key: "Payment History",
      component: <PaymentDetails data={installmentstate} />,
    },
    {
      name: "Batch Info",
      key: "Batch Info",
      component: <BatchProfile batchdata={batchdetails} />,
    },
    {
      name: "Attendance QR",
      key: "Attendance QR",
      component: <AttendanceManagement data={data} />,
    },
    {
      name: "Attendance Sheet",
      key: "Attendance Sheet",
      component: <AttendanceSheet records={recordsheet} />,
    },
  ];

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="preview-dialog-title"
      fullWidth
      maxWidth="xl"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DialogTitle
          id="preview-dialog-title"
          sx={{ fontWeight: "bold", margin: 0 }}
        >
          Detailed Information
        </DialogTitle>

        <DialogActions className="mr-4 !p-0 !w-fit">
          <CloseIcon
            onClick={handleClose}
            className="hover:text-white hover:bg-red-500 !border !size-7 p-1 rounded-lg border-red-600 text-red-600 cursor-pointer"
            fontSize="small"
          />
        </DialogActions>
      </div>

      <DialogContent>
        <DialogContentText>
          {data ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px",
                }}
              >
                <PortraitIcon
                  sx={{
                    height: "200px",
                    width: "200px",
                    color: "#0d1b2a",
                    marginRight: "50px",
                    marginTop: "50px",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ flex: 1, marginRight: "20px" }}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        marginBottom: "10px",
                      }}
                    >
                      Student Info:
                    </Typography>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <tbody>
                        {Object.entries(data.additionalFields.formdata).map(
                          ([label, value], index) => (
                            <tr key={index}>
                              <td
                                style={{
                                  padding: "8px",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                <strong>{label}</strong>
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                {value || "N/A"}
                              </td>
                            </tr>
                          )
                        )}
                        <tr>
                          <td
                            style={{
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            <strong>{"Enrollment Date"}</strong>
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {data.installementDate}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        marginBottom: "10px",
                      }}
                    >
                      Payment Stats:
                    </Typography>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <tbody>
                        {[
                          {
                            label: "Advance Amount",
                            value: paymentstats.advanceamount,
                          },
                          {
                            label: "Due Amount",
                            value: paymentstats.dueamount,
                          },
                          {
                            label: "Next Installment",
                            value: paymentstats.nextpaymentdate,
                          },
                          { label: "Fees", value: data.additionalFields.fees },
                        ].map(({ label, value }) => (
                          <tr key={label}>
                            <td
                              style={{
                                padding: "8px",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              <strong>{label}</strong>
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              {value || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <Divider sx={{ marginY: 1 }} />

              <nav className="bg-white text-black p-2 shadow-md">
                <ul className="flex space-x-2">
                  {menuItems.map((item) => (
                    <li key={item.key}>
                      <button
                        onClick={() => setActiveTab(item.key)}
                        className={`px-4 py-2 border-b-2 ${
                          activeTab === item.key
                            ? "border-blue-500 text-blue-500"
                            : "border-transparent"
                        }`}
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div style={{ padding: "20px" }}>
                {menuItems.map(
                  (item) =>
                    activeTab === item.key && (
                      <div key={item.key}>{item.component}</div>
                    )
                )}
              </div>
            </>
          ) : (
            <Typography>No information available.</Typography>
          )}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default ProfilePreview;
