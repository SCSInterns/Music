import React, { useState } from "react";
import {
  Typography,
  Grid,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import PortraitIcon from "@mui/icons-material/Portrait";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

function ProfilePreview({ open, onClose, data, installmentstate }) {
  console.log(data);
  console.log(installmentstate);

  // States
  const [actiontoggle, setactiontoggle] = useState(false);
  const [paymnetaddbox, setpaymnetaddbox] = useState(false);
  const [toggleinstallment, settoggleinstallment] = useState(false);
  const [togglebatch, settogglebatch] = useState(false);
  const [togglesheet, settogglesheet] = useState(false);
  const [toggleqr, settoggleqr] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [batchdata, setBatchData] = useState([]);
  const [recordsheet, setRecordSheet] = useState([]);

  // Event Handlers
  const handleclick = (action, id) => {
    console.log(`Action: ${action}, ID: ${id}`);
  };

  const handleClose = () => {
    setOpenDialog(false);
    onClose();
  };

  const handleactiontoggle = (toggle) => {
    console.log(`Toggle action: ${toggle}`);
    setactiontoggle(toggle);
  };

  const handlePaymentToggle = (toggle) => {
    console.log(`Payment toggle: ${toggle}`);
    setpaymnetaddbox(toggle);
  };

  const handleInstallmentToggle = (toggle) => {
    console.log(`Installment toggle: ${toggle}`);
    settoggleinstallment(toggle);
  };

  const handleBatchToggle = (toggle) => {
    console.log(`Batch toggle: ${toggle}`);
    settogglebatch(toggle);
  };

  const handleQrToggle = (toggle) => {
    console.log(`QR toggle: ${toggle}`);
    settoggleqr(toggle);
  };

  const handleSheetToggle = (toggle) => {
    console.log(`Sheet toggle: ${toggle}`);
    settogglesheet(toggle);
  };

  const commonStyles = {
    flexContainer: { display: "flex", justifyContent: "space-between" },
    verticalFlex: { display: "flex", flexDirection: "column" },
    centeredFlex: { display: "flex", alignItems: "center" },
    buttonSpacing: { marginLeft: "20px" },
  };

  const renderStatusActionButtons = (status, id) => (
    <div style={{ padding: "10px", margin: "10px", display: "flex" }}>
      {["Accept", "Reject", "Hold"].map(
        (action) =>
          status !== action && (
            <Button
              key={action}
              variant="contained"
              onClick={() => handleclick(action, id)}
              sx={commonStyles.buttonSpacing}
            >
              {action}
            </Button>
          )
      )}
    </div>
  );

  const renderToggleButton = (toggle, toggleHandler, IconOn, IconOff) => (
    <Button onClick={toggleHandler}>{toggle ? <IconOn /> : <IconOff />}</Button>
  );

  const renderActionButtons = (status) => {
    const actions = [
      {
        label: "Add Payment",
        toggle: "setpaymnetaddbox",
        disabled: status === "Reject",
      },
      { label: "Payment History", toggle: "settoggleinstallment" },
      {
        label: "Batch Info",
        toggle: "settogglebatch",
        disabled: status === "Reject",
      },
      {
        label: "Attendance QR",
        toggle: "settoggleqr",
        disabled: status === "Reject",
      },
      {
        label: "Attendance Sheet",
        toggle: "settogglesheet",
        disabled: status === "Reject",
      },
    ];

    return (
      <div style={commonStyles.flexContainer}>
        {actions.map(({ label, toggle, disabled }) => (
          <Button
            key={label}
            variant="contained"
            disabled={disabled}
            onClick={() => {
              const toggles = {
                setpaymnetaddbox: handlePaymentToggle,
                settoggleinstallment: handleInstallmentToggle,
                settogglebatch: handleBatchToggle,
                settoggleqr: handleQrToggle,
                settogglesheet: handleSheetToggle,
              };
              toggles[toggle](true);
            }}
          >
            {label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="preview-dialog-title"
        aria-describedby="preview-dialog-description"
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle id="preview-dialog-title" sx={{ fontWeight: "bold" }}>
          Detailed Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="preview-dialog-description">
            {data ? (
              <>
                <div style={commonStyles.flexContainer}>
                  <PortraitIcon
                    sx={{
                      height: "200px",
                      width: "200px",
                      color: "#0d1b2a",
                      marginRight: "50px",
                    }}
                  />
                  <div>
                    <Grid container spacing={2}>
                      {Object.entries(data.additionalFields.formdata).map(
                        ([label, value], index) => (
                          <Grid item xs={12} sm={4} key={index}>
                            <Typography>
                              <strong>{label}</strong>: {value || "N/A"}
                            </Typography>
                          </Grid>
                        )
                      )}
                    </Grid>
                    <Typography sx={{ marginTop: "20px", fontWeight: "bold" }}>
                      Payment Stats :
                    </Typography>
                    <div style={commonStyles.flexContainer}>
                      {[
                        {
                          label: "Advance Amount",
                          value: data.paymentstats?.advanceamount,
                        },
                        {
                          label: "Due Amount",
                          value: data.paymentstats?.dueamount,
                        },
                        {
                          label: "Next Installment",
                          value: data.paymentstats?.nextpaymentdate,
                        },
                        { label: "Fees", value: data.additionalFields.fees },
                      ].map(({ label, value }) => (
                        <Typography key={label} sx={{ marginTop: "20px" }}>
                          <strong>{label}</strong>: {value || "N/A"}
                        </Typography>
                      ))}
                    </div>
                  </div>
                  <div style={commonStyles.verticalFlex}>
                    <div style={commonStyles.centeredFlex}>
                      <Typography>
                        <strong>Status</strong>: {data.status}
                      </Typography>
                      {renderToggleButton(
                        actiontoggle,
                        () => handleactiontoggle(!actiontoggle),
                        ArrowCircleUpIcon,
                        ArrowCircleDownIcon
                      )}
                    </div>
                    {actiontoggle &&
                      renderStatusActionButtons(data.status, data._id)}
                  </div>
                </div>
                <Divider sx={{ marginTop: "30px", marginBottom: "30px" }} />
                {renderActionButtons(data.status)}
              </>
            ) : (
              <Typography>No information available.</Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProfilePreview;
