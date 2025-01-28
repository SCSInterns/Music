import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { CreditCard, AlertCircle, IndianRupee } from "lucide-react";
import Token from "../../Token/Token";
import { toast } from "react-toastify";

export default function AnalyticsPage() {
  const [paymentdate, setPaymentDate] = useState("");
  const [analytics, setAnalytics] = useState({});
  const [defstats, setDefstats] = useState({});

  const token = Token();
  const role = sessionStorage.getItem("role");
  const academyname = sessionStorage.getItem("academyname");

  const fetchDefaultIncome = async () => {
    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/fetchacademyaccount";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
        academyname: academyname,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setDefstats(data);
    } else {
      const msg = data.message;
      toast.error(msg);
    }
  };

  useEffect(() => {
    fetchDefaultIncome();
  }, []);

  const handleSubmit = async () => {
    const [year, month, day] = paymentdate.split("-");
    console.log(month);
    console.log(year);

    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/fetchcustomstats";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        month: month,
        year: year,
        role: role,
        academyname: academyname,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setAnalytics(data);
    } else {
      const message = data.message;
      toast.error(message);
    }
  };

  const handleReset = () => {
    setPaymentDate("");
    setAnalytics({});
  };

  console.log(analytics);

  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Academy Payment Analytics</h1>

      <div className="flex space-x-10 items-center">
        {/* Date Picker */}
        <Box className="mb-8">
          <Typography variant="subtitle1" fontWeight="bold" className="!mb-2">
            Select Month & Year :
          </Typography>
          <input
            type="month"
            id="datePicker"
            name="datePicker"
            value={paymentdate}
            max={currentMonth}
            onChange={(e) => setPaymentDate(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              width: "200px",
              height: "50px",
              border: "1px solid #ddd",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              fontSize: "14px",
              backgroundColor: "#f9f9f9",
            }}
          />
        </Box>

        <Box display="flex" gap={4} mb={6} mt={6}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <Card className="shadow-lg !rounded-xl !bg-[#0d1b2a] !text-white h-auto">
          <CardHeader
            className="flex flex-row items-center justify-between"
            title={
              <Typography variant="subtitle1" className="font-medium">
                Total Paid
              </Typography>
            }
            avatar={<IndianRupee className="h-5 w-5 text-white" />}
          />
          <CardContent>
            <Typography variant="h5" className="font-bold">
              {/* Check if analytics has data, else use defstats */}
              <span>
                {" "}
                ₹{" "}
                {analytics?.totalpaid != null
                  ? analytics.totalpaid
                  : defstats.totalpaid ?? 0}{" "}
              </span>
            </Typography>
          </CardContent>
        </Card>

        <Card className="shadow-lg !rounded-xl !bg-[#0d1b2a] !text-white h-auto">
          <CardHeader
            className="flex flex-row items-center justify-between"
            title={
              <Typography variant="subtitle1" className="font-medium">
                Total Due
              </Typography>
            }
            avatar={<AlertCircle className="h-5 w-5 text-white" />}
          />
          <CardContent>
            <Typography variant="h5" className="font-bold">
              {/* Check if analytics has data, else use defstats */}
              <span>
                {" "}
                ₹{" "}
                {analytics?.totaldue != null
                  ? analytics.totaldue
                  : defstats.totaldue ?? 0}{" "}
              </span>
            </Typography>
          </CardContent>
        </Card>

        <Card className="shadow-lg !rounded-xl !bg-[#0d1b2a] !text-white h-auto">
          <CardHeader
            className="flex flex-row items-center justify-between"
            title={
              <Typography variant="subtitle1" className="font-medium">
                Total Income
              </Typography>
            }
            avatar={<CreditCard className="h-5 w-5 text-white" />}
          />
          <CardContent>
            <Typography variant="h5" className="font-bold">
              {/* Check if analytics has data, else use defstats */}
              <span>
                {" "}
                ₹{" "}
                {analytics?.totalincome != null
                  ? analytics.totalincome
                  : defstats.totalincome ?? 0}{" "}
              </span>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
