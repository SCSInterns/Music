import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Collapse,
  TextField,
} from "@mui/material";
import ProfileMenu from "./ProfileMenu";
import StatusHandler from "./AcademyStatus";
import CloseIcon from "@mui/icons-material/Close";
import Token from "../Token/Token";
import { toast } from "react-toastify";

function DetailedInfo({
  details,
  admin,
  handleClose,
  handlestatus,
  open,
  handlesharecred,
  inputChange,
  credsend,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
    width: "90%",
    maxWidth: "1000px",
  };

  const renderTableRows = (data) => {
    return data.map((field, index) => (
      <tr key={index}>
        <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
          <strong>{field.label}</strong>
        </td>
        <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
          {field.value || "N/A"}
        </td>
      </tr>
    ));
  };

  const role = sessionStorage.getItem("role");

  const [info, setinfo] = useState([]);

  const fetchlist = async (academyname, academyid) => {
    const url = `https://music-academy-e32v.onrender.com/api/auth/getsubspaymentlist`;

    let token = Token();
    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyname: academyname,
          role: role,
          adminid: academyid,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setinfo(data);
      }
    } catch (error) {
      toast.error("Network error", error);
    }
  };

  useEffect(() => {
    fetchlist(admin[0].academy_name, admin[0].academy_id);
  }, []);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, maxHeight: "80vh", overflowY: "auto" }}>
          <div className="mb-5">
            <Button
              onClick={handleClose}
              color="error"
              sx={{ float: "right", paddingBottom: "5px" }}
              variant="outlined"
            >
              <CloseIcon fontSize="medium" />
            </Button>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              gutterBottom
            >
              Academy Details
            </Typography>
          </div>
          <Divider />
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Left Column - Academy Data */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Academy Data
                </Typography>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {renderTableRows([
                      { label: "Name", value: details.academy_name },
                      { label: "Address", value: details.academy_address },
                      { label: "City", value: details.academy_city },
                      { label: "State", value: details.academy_state },
                      { label: "Pincode", value: details.academy_pincode },
                      { label: "Contact No", value: details.academy_contactno },
                    ])}
                  </tbody>
                </table>
              </Grid>

              {/* Right Column - Access Data */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Access Data
                </Typography>
                {admin.length > 0 && (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {renderTableRows([
                        { label: "Academy Name", value: admin[0].academy_name },
                        { label: "Email", value: admin[0].academy_email },
                        {
                          label: "Payment Status",
                          value: admin[0].paymentstatus,
                        },
                        { label: "Renewal Date", value: admin[0].renewaldate },
                        { label: "Access", value: admin[0].academy_access },
                        { label: "URL", value: admin[0].academy_url },
                      ])}
                    </tbody>
                  </table>
                )}
              </Grid>
            </Grid>

            <div className="mt-10">
              <ProfileMenu
                admin={admin}
                handlestatus={handlestatus}
                details={details}
                renderTableRows={renderTableRows}
                credsend={credsend}
                inputChange={inputChange}
                handlesharecred={handlesharecred}
                info={info}
              />
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default DetailedInfo;
