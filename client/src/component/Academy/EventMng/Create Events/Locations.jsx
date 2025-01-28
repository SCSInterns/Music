import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatelocation } from "../../../Features/LocationSlice";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tooltip,
} from "@mui/material";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import NearMeIcon from "@mui/icons-material/NearMe";
import Token from "../../../Token/Token";
import { setVenues } from "../../../Features/VenuesSlice";

const LocationForm = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.location);
  const token = Token();
  const [localState, setLocalState] = useState(formData.state);
  const [localCity, setLocalCity] = useState(formData.city);
  const currentVenues = useSelector((state) => state.venues.venues);
  const country = "IN";
  const states = State.getStatesOfCountry(country);
  const cities = localState ? City.getCitiesOfState(country, localState) : [];
  const [open, setopen] = useState(false);

  const handleopener = () => {
    setopen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      setLocalState(value);
      setLocalCity("");
    } else if (name === "city") {
      setLocalCity(value);
    }
  };

  const validatemaplink = (maplink) => {
    const regex = /^https?:\/\/maps\.app\.goo\.gl\/[A-Za-z0-9]+$/;
    return regex.test(maplink);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const maplink = formData.maplink.trim();
    const correctlink = validatemaplink(maplink);
    if (!correctlink) {
      toast.error("Please enter a valid map link");
      return;
    }

    const pincode = formData.pincode.trim();
    const regex = /^\d{6}$/;
    if (!regex.test(pincode)) {
      toast.error("Please enter a valid pincode");
      return;
    }

    dispatch(
      updatelocation({
        ...formData,
        state: localState,
        city: localCity,
      })
    );

    const url = "http://localhost:5000/api/auth/createvenuedetails";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        venuename: formData.venuname,
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode,
        maplink: formData.maplink,
        role: sessionStorage.getItem("role"),
      }),
    });

    const data = await response.json();
    if (response.ok) {
      dispatch(setVenues(data));
      dispatch(
        updatelocation({
          venuname: "",
          city: "",
          state: "",
          pincode: "",
          maplink: "",
        })
      );
      toast.success("Venue Details Created Successfully");
    } else {
      toast.error("Venue Details Creation Failed");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Venue Name"
              variant="outlined"
              fullWidth
              required
              name="venuname"
              value={formData.venuname}
              onChange={(e) =>
                dispatch(updatelocation({ [e.target.name]: e.target.value }))
              }
            />
          </Grid>

          <div className="flex  space-x-10 my-6 mx-4">
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Country</InputLabel>
                <Select
                  label="Country"
                  name="country"
                  value="India"
                  onChange={handleInputChange}
                  disabled
                >
                  <MenuItem value="India">India</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>State</InputLabel>
                <Select
                  label="State"
                  name="state"
                  value={localState}
                  onChange={handleInputChange}
                >
                  {states.map((state) => (
                    <MenuItem key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>City</InputLabel>
                <Select
                  label="City"
                  name="city"
                  value={localCity}
                  onChange={handleInputChange}
                >
                  {cities.map((city) => (
                    <MenuItem key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Pincode"
                type="number"
                variant="outlined"
                fullWidth
                required
                inputProps={{ maxLength: 6 }}
                name="pincode"
                value={formData.pincode}
                onChange={(e) =>
                  dispatch(updatelocation({ [e.target.name]: e.target.value }))
                }
              />
            </Grid>
          </div>

          <Grid item xs={12}>
            <div className="flex items-center">
              <TextField
                label="Map Link"
                variant="outlined"
                fullWidth
                required
                name="maplink"
                value={formData.maplink}
                onChange={(e) =>
                  dispatch(updatelocation({ [e.target.name]: e.target.value }))
                }
              />
              <a href={formData.maplink} target="_blank">
                <Tooltip title="Open in Maps">
                  <Button
                    onClick={() => {
                      handleopener();
                    }}
                  >
                    <NearMeIcon />
                  </Button>
                </Tooltip>
              </a>
            </div>
          </Grid>

          <Grid item xs={12} my={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ float: "right" }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default LocationForm;
