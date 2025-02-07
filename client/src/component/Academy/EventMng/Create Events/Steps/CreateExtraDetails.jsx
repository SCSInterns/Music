import React, { useState } from "react";
import BannerImagePicker from "../CreateLayout/BannerUploader";
import Token from "../../../../Token/Token";
import { toast } from "react-toastify";
import {
  TextField,
  IconButton,
  Button,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

function CreateExtraDetails() {
  const token = Token();
  const [coupons, setCoupons] = useState([
    { id: Date.now(), name: "", discount: "", tickets: "", expirydate: "" },
  ]);

  // Function to add a new coupon section
  const addCoupon = () => {
    setCoupons([
      ...coupons,
      { id: Date.now(), name: "", discount: "", tickets: "", expirydate: "" },
    ]);
  };

  // Function to remove a coupon section
  const removeCoupon = (id) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== id));
  };

  return (
    <>
      <div>
        <div className="!my-4">
          <h3 className="text-md text-left my-4 font-semibold">
            Add terms and conditions * :
          </h3>
          <TextField
            multiline
            rows={6}
            variant="outlined"
            fullWidth
            inputProps={{ whiteSpace: "pre-wrap" }}
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
                name="couponname"
              />
              <TextField
                label="Discount in Rs."
                type="number"
                variant="outlined"
                name="discount"
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Maximum Tickets upto"
                type="number"
                variant="outlined"
                name="tickets"
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
            />
            <TextField
              label="Discount in Rs. per ticket"
              type="number"
              variant="outlined"
              name="discount"
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Minimum Tickets Required"
              type="number"
              variant="outlined"
              name="tickets"
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
              inputProps={{ min: 0 }}
            />
          </div>

          <div className="my-4 float-right">
            <Button variant="contained">Next</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateExtraDetails;
