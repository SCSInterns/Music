import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DollarSign, CreditCard, AlertCircle } from "lucide-react";

const getAnalyticsData = (year, month) => {
  return {
    totalPaid: Math.floor(Math.random() * 10000),
    totalDue: Math.floor(Math.random() * 5000),
    totalOutstanding: Math.floor(Math.random() * 3000),
  };
};

export default function AnalyticsPage() {
  const [year, setYear] = useState("2023");
  const [month, setMonth] = useState("1");
  const [analytics, setAnalytics] = useState(getAnalyticsData(year, month));

  const updateAnalytics = () => {
    setAnalytics(getAnalyticsData(year, month));
  };

  const years = ["2023", "2024", "2025"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-12">
        Monthly Academy Payment Analytics
      </h1>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
        <FormControl fullWidth>
          <InputLabel id="year-select-label">Select Year</InputLabel>
          <Select
            labelId="year-select-label"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              updateAnalytics();
            }}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="month-select-label">Select Month</InputLabel>
          <Select
            labelId="month-select-label"
            value={month}
            onChange={(e) => {
              setMonth((parseInt(e.target.value) + 1).toString());
              updateAnalytics();
            }}
          >
            {months.map((m, index) => (
              <MenuItem key={index} value={index}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg !rounded-xl !bg-[#0d1b2a] !text-white h-auto">
          <CardHeader
            className="flex flex-row items-center justify-between"
            title={
              <Typography variant="subtitle1" className="font-medium">
                Total Paid
              </Typography>
            }
            avatar={<DollarSign className="h-5 w-5 text-white" />}
          />
          <CardContent>
            <Typography variant="h5" className="font-bold">
              ${analytics.totalPaid.toLocaleString()}
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
            avatar={<CreditCard className="h-5 w-5 text-white" />}
          />
          <CardContent>
            <Typography variant="h5" className="font-bold">
              ${analytics.totalDue.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        <Card className="shadow-lg  !rounded-xl !bg-[#0d1b2a] !text-white h-auto">
          <CardHeader
            className="flex flex-row items-center justify-between"
            title={
              <Typography variant="subtitle1" className="font-medium">
                Total Outstanding
              </Typography>
            }
            avatar={<AlertCircle className="h-5 w-5 text-white" />}
          />
          <CardContent>
            <Typography variant="h5" className="font-bold">
              ${analytics.totalOutstanding.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
