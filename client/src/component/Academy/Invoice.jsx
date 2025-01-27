import { useEffect, useState } from "react";
import { Eye, Crown } from "lucide-react";
import { format } from "date-fns";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import { Badge } from "@mui/material";
import { Card, CardContent, CardHeader } from "@mui/material";
import { Box } from "@mui/material";
import Token from "../Token/Token";
import CancelSubscriptionForm from "./CancelSubScriptionForm";

function BillingDashboard({ info, admin }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  console.log(info);

  const [details, setdetails] = useState("");
  const [fulladdress, setfulladdress] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getacademydetails = async (academyname) => {
    const url =
      "https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/getacademydetails";

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
      const data = await response.json();
      setdetails(data[0]);
      constructAddress(data[0]);
    }
  };

  function constructAddress(response) {
    const { academy_address, academy_city, academy_state, academy_pincode } =
      response || "N/A";

    const fullAddress = `${academy_address}, ${academy_city}, ${academy_state} - ${academy_pincode}`;
    setfulladdress(fullAddress);
    return;
  }

  useEffect(() => {
    if (admin && info.length > 0) {
      getacademydetails(admin.academy_name);
    }
  }, [admin]);

  function deductGST(amount, gstRate = 18) {
    const gstAmount = (amount * gstRate) / 100;
    const amountWithoutGST = amount - gstAmount;

    return {
      amountWithoutGST,
      gstAmount,
    };
  }

  const finalamount = deductGST(4000);

  return (
    <>
      <div className="space-y-8 p-8">
        {/* Subscription Card */}
        <div className="flex items-start gap-4">
          <Card className="flex-1 shadow-lg rounded-xl border border-gray-300 hover:shadow-xl transition-all">
            <CardContent>
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-blue-500" />
                <h1 className="font-bold text-xl">
                  {admin.paymentstatus === "Free Trial"
                    ? "Free Trial"
                    : "Advanced"}
                </h1>
              </div>
            </CardContent>
            <CardContent>
              <div className="space-y-3 mb-10">
                <Typography variant="body2" className="text-blue-500">
                  {admin.renewaldate
                    ? `Active Until ${admin.renewaldate} `
                    : "Contact Service Provider "}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  We will send you a notification upon subscription expiration.
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  className="float-left"
                  sx={{ marginBottom: "10px" }}
                  onClick={handleClickOpen}
                >
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History Table */}
        <Card>
          <CardHeader>
            <Typography>Payment History</Typography>
          </CardHeader>
          <CardContent>
            <TableContainer className="bg-white rounded-lg shadow-md">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Package Name</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Invoice</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {info.length > 0 ? (
                    <>
                      {info.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>Advance</TableCell>
                          <TableCell>{invoice.paymentdate}</TableCell>
                          <TableCell>{invoice.nextpaymentdate}</TableCell>
                          <TableCell>₹{invoice.amount}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={() => setSelectedInvoice(invoice)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body1" className="text-center">
                            No records found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Invoice Modal */}
        <Dialog
          className="overflow-hidden"
          open={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          sx={{
            "& .MuiDialog-paper": {
              width: "80%",
              maxWidth: "1000px",
              height: "90vh",
              overflow: "hidden",
            },
          }}
        >
          <DialogContent>
            <DialogTitle>Invoice</DialogTitle>
            {selectedInvoice && (
              <div className="space-y-10">
                {/* Invoice Header */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  marginBottom={3}
                >
                  <Box display="flex" gap={4} alignItems="center">
                    <Box>
                      <Typography variant="h6">SoftCoding Solutions</Typography>
                      <Typography variant="body2">
                        51B Solaris Business Hub Near Bhuyangdev
                      </Typography>
                      <Typography variant="body2">
                        Cross Road, Sola Rd. opp. Parshwanath Jain
                      </Typography>
                      <Typography variant="body2">
                        mandir, Ahmedabad, Gujarat 380061
                      </Typography>
                    </Box>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h5">INVOICE</Typography>
                    <Typography variant="body2">
                      Invoice Date: {selectedInvoice.paymentdate}
                    </Typography>
                    <Typography variant="body2">
                      Invoice Amount: ₹{selectedInvoice.amount.toLocaleString()}
                      (INR)
                    </Typography>
                    <Badge
                      variant="filled"
                      color="success"
                      className="mt-2 text-green-500"
                    >
                      PAID
                    </Badge>
                  </Box>
                </Box>

                {/* Billed To */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    BILLED TO
                  </Typography>
                  <Typography variant="h6">
                    {" "}
                    {admin.academy_name} - Music Academy
                  </Typography>
                  <Typography variant="body2">{fulladdress}</Typography>
                </Box>

                {/* Subscription */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    SUBSCRIPTION
                  </Typography>
                  <Typography variant="body2">
                    Next Billing Date : {selectedInvoice.nextpaymentdate}
                  </Typography>
                </Box>

                {/* Invoice Details */}
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>DATE</TableCell>
                        <TableCell>DESCRIPTION</TableCell>
                        <TableCell>SERVICE PERIOD</TableCell>
                        <TableCell>AMOUNT</TableCell>
                        <TableCell>GST (%)</TableCell>
                        <TableCell>GST (INR) </TableCell>
                        <TableCell>SUBTOTAL</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{selectedInvoice.paymentdate}</TableCell>
                        <TableCell>Advance</TableCell>
                        <TableCell>
                          {selectedInvoice.paymentdate} -{" "}
                          {selectedInvoice.nextpaymentdate}
                        </TableCell>
                        <TableCell>
                          {finalamount.amountWithoutGST.toLocaleString()}
                        </TableCell>
                        <TableCell>18%</TableCell>
                        <TableCell>
                          {finalamount.gstAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>₹ 4,000.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Total */}
                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                  <Box width={180} textAlign="right">
                    <Typography variant="h6" className="font-semibold">
                      Total
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ₹4,000.00
                    </Typography>
                  </Box>
                </Box>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedInvoice(null)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <CancelSubscriptionForm open={open} handleClose={handleClose} />
    </>
  );
}

export default BillingDashboard;
