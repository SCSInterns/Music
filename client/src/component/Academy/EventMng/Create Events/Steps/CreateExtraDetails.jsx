import React, { useState } from "react";
import BannerImagePicker from "../CreateLayout/BannerUploader";
import Token from "../../../../Token/Token";
import { toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  TextField,
  IconButton,
  Button,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Grid,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useDispatch, useSelector } from "react-redux";
import { nextStep } from "../../../../Features/StepperSlice";

function CreateExtraDetails() {
  const token = Token();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.event);
  const [coupons, setCoupons] = useState([
    { id: Date.now(), name: "", discount: "", tickets: "", expirydate: "" },
  ]);
  const [eventdesc, seteventdesc] = useState("");
  const [eventtermscond, seteventtermscond] = useState("");
  const [contact, setcontact] = useState("");
  const [groupdiscount, setgroupdiscount] = useState({
    couponname: "",
    Discount: "",
    MinimumTickets: "",
  });
  const [age, setage] = useState("");
  const [sponsers, setsponsers] = useState("");
  const eventid = formData.eventid;

  console.log(eventid);

  const addCoupon = () => {
    setCoupons([
      ...coupons,
      { id: Date.now(), name: "", discount: "", tickets: "", expirydate: "" },
    ]);
  };

  const handleInputChange = (id, field, value) => {
    setCoupons((prevCoupons) =>
      prevCoupons.map((coupon) =>
        coupon.id === id ? { ...coupon, [field]: value } : coupon
      )
    );
  };

  const removeCoupon = (id) => {
    setCoupons((prevCoupons) =>
      prevCoupons.filter((coupon) => coupon.id !== id)
    );
  };

  const handleaigeneration = async () => {
    if (formData.eventid === "") {
      toast.error("Please complete the previous step before proceeding");
      return;
    }

    const url = "http://localhost:5000/api/auth/generateeventdescwithai";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        eventid: eventid,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.description;
      seteventdesc(content);
    }
  };

  const handleSubmit = async () => {
    if (formData.eventid === "") {
      toast.error("Please complete the previous step before proceeding");
      return;
    }
    const url = "http://localhost:5000/api/auth/createextradetails";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        role: sessionStorage.getItem("role"),
        id: eventid,
        Sponsers: sponsers,
        Coupon: coupons,
        Group: groupdiscount,
        TermsAndConditions: eventtermscond,
        ContactInformation: contact,
        description: eventdesc,
        agefree: age,
      }),
    });

    if (response.ok) {
      toast.success("Info Saved Success");
      dispatch(nextStep());
    } else {
      toast.error("Error Saving Info");
    }
  };

  return (
    <>
      <div>
        <div className="my-4">
          <h3 className="text-md text-left my-4 font-semibold">
            Add Event Description* :
          </h3>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={8}
              name="description"
              value={eventdesc}
              onChange={(e) => {
                seteventdesc(e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <Tooltip title="Create with AI" className="py-2">
                    <InputAdornment
                      position="end"
                      sx={{
                        top: 10,
                        position: "absolute",
                        right: 0,
                        cursor: "pointer",
                      }}
                    >
                      <Button
                        size="small"
                        sx={{ border: "none", cursor: "pointer" }}
                        onClick={() => {
                          handleaigeneration();
                        }}
                      >
                        <AutoFixHighIcon className="w-10 h-10" />
                      </Button>
                    </InputAdornment>
                  </Tooltip>
                ),
                whiteSpace: "pre-wrap",
              }}
            />
          </Grid>
        </div>

        <Divider />

        <div className="!my-4">
          <h3 className="text-md text-left my-4 font-semibold">
            Add terms and conditions * :
          </h3>
          <TextField
            multiline
            rows={6}
            variant="outlined"
            fullWidth
            value={eventtermscond}
            onChange={(e) => {
              seteventtermscond(e.target.value);
            }}
            sx={{
              "& .MuiInputBase-input": {
                whiteSpace: "pre-wrap",
              },
            }}
          />
        </div>

        <Divider />

        <Divider />

        {/* Contact Info  */}
        <div className="flex space-x-5 flex-row items-center  my-3">
          <FormLabel component="legend" sx={{ fontWeight: "bold" }}>
            Contact Info Required for all tickets * :
          </FormLabel>
          <RadioGroup
            aria-label="seat-layout"
            name="seatLayout"
            sx={{ display: "flex", gap: 3, flexDirection: "row" }}
            onChange={(e) => setcontact(e.target.value)}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </div>

        <Divider />

        {/* Coupon Code Section */}
        <div className="!my-3">
          <div className="flex space-x-16 items-center">
            <h3 className="text-md text-left my-2 font-semibold">
              Add Coupon Code (if any):
            </h3>

            <div className="mt-2">
              <Button
                onClick={addCoupon}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              >
                <Add />
              </Button>
            </div>
          </div>

          {coupons.map((coupon, index) => (
            <div key={coupon.id} className="flex space-x-5 items-center my-3">
              <TextField
                label="Coupon Name"
                variant="outlined"
                name="name"
                onChange={(e) =>
                  handleInputChange(coupon.id, "name", e.target.value)
                }
              />
              <TextField
                label="Discount in Rs."
                type="number"
                variant="outlined"
                onChange={(e) =>
                  handleInputChange(coupon.id, "discount", e.target.value)
                }
                name="discount"
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Maximum Tickets upto"
                type="number"
                variant="outlined"
                name="tickets"
                onChange={(e) =>
                  handleInputChange(coupon.id, "tickets", e.target.value)
                }
                inputProps={{ min: 0 }}
              />
              <div className="flex flex-col mb-8">
                <label htmlFor={`expirydate-${coupon.id}`} className="!mb-1">
                  Expiry Date (skip if N/A) :
                </label>
                <input
                  type="date"
                  name="expirydate"
                  id={`expirydate-${coupon.id}`}
                  onChange={(e) =>
                    handleInputChange(coupon.id, "expirydate", e.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="p-4 rounded-md bg-[#f1f5f9] border border-gray-500 text-gray-500"
                />
              </div>

              {/* Remove Coupon Button */}
              {coupons.length > 1 && (
                <IconButton
                  onClick={() => removeCoupon(coupon.id)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              )}
            </div>
          ))}
        </div>

        <Divider />

        {/* Group Discount Section  */}

        <div className="!my-3">
          <h3 className="text-md text-left my-2 font-semibold">
            Add Group Discounts (if any):
          </h3>

          <div className="flex space-x-5 items-center my-4">
            <TextField
              label="Coupon Name"
              variant="outlined"
              name="couponname"
              value={groupdiscount.couponname}
              onChange={(e) => {
                setgroupdiscount({
                  ...groupdiscount,
                  couponname: e.target.value,
                });
              }}
            />
            <TextField
              label="Discount in Rs. per ticket"
              type="number"
              variant="outlined"
              name="discount"
              value={groupdiscount.Discount}
              onChange={(e) => {
                setgroupdiscount({
                  ...groupdiscount,
                  Discount: e.target.value,
                });
              }}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Minimum Tickets Required"
              type="number"
              variant="outlined"
              name="tickets"
              value={groupdiscount.MinimumTickets}
              onChange={(e) => {
                setgroupdiscount({
                  ...groupdiscount,
                  MinimumTickets: e.target.value,
                });
              }}
              inputProps={{ min: 0 }}
            />
          </div>
        </div>

        <Divider />

        {/* Age Free Tickets  */}
        <div className="!my-3">
          <h3 className="text-md text-left my-2 font-semibold">
            Add Age Criteria for free tickets (if any):
          </h3>

          <div className="flex space-x-5 items-center my-4">
            <TextField
              label="Maximum Age Limit"
              type="number"
              variant="outlined"
              name="tickets"
              value={age}
              onChange={(e) => {
                setage(e.target.value);
              }}
              inputProps={{ min: 0 }}
            />
          </div>
        </div>

        <Divider />

        <div className="my-3">
          <h3 className="text-md text-left my-2 font-semibold">
            Add Tickets to be given to sponsers (if any):
          </h3>

          <div className="flex space-x-5 items-center my-4">
            <TextField
              label="Tickets Sponsered"
              type="number"
              variant="outlined"
              name="tickets"
              value={sponsers}
              onChange={(e) => {
                setsponsers(e.target.value);
              }}
              inputProps={{ min: 0 }}
            />
          </div>

          <div className="my-4 float-right">
            <Button
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
            >
              Submit & Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateExtraDetails;
