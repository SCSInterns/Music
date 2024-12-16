import React from "react";

function DetailedInfo({ details, admin }) {
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Academy Details
          </Typography>

          <Divider />
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Academy Data:</Typography>
                <TextField
                  label="ID"
                  value={details._id || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Name"
                  value={details.academy_name || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Address"
                  value={details.academy_address || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="City"
                  value={details.academy_city || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="State"
                  value={details.academy_state || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Pincode"
                  value={details.academy_pincode || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Contact No"
                  value={details.academy_contactno || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Personal Data:</Typography>
                <TextField
                  label="Name"
                  value={details.name || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Address"
                  value={details.address || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Contact no. "
                  value={details.contactno || ""}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Divider sx={{ marginTop: "10px" }} />
                <Typography variant="h6" marginTop={2}>
                  Access Data:
                </Typography>
                {admin.length > 0 && (
                  <>
                    <TextField
                      label="Academy Name"
                      value={admin[0].academy_name || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="Username"
                      value={admin[0].academy_username || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="Password"
                      value={admin[0].academy_password || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="Email"
                      value={admin[0].academy_email || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="paymentstatus"
                      value={admin[0].paymentstatus || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="renewaldate"
                      value={admin[0].renewaldate || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="Access"
                      value={admin[0].academy_access || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="Url"
                      value={admin[0].academy_url || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        margin: "20px",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handlestatus(admin[0]._id, "Accept")}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handlestatus(admin[0]._id, "Reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  </>
                )}
              </Grid>
            </Grid>

            {credsend ? (
              <>
                {" "}
                <Typography style={{ marginTop: "30px" }}>
                  Set Academy Credentials:
                </Typography>
                <div
                  style={{
                    display: "flex",
                    marginTop: "20px",
                    justifyContent: "space-evenly",
                  }}
                >
                  <TextField
                    name="username"
                    label="Academy username"
                    onChange={inputChange}
                  />
                  <TextField
                    name="password"
                    label="Academy password"
                    onChange={inputChange}
                  />
                </div>
                <div>
                  <Button
                    variant="contained"
                    sx={{ margin: "40px" }}
                    onClick={() =>
                      handlesharecred(admin[0].academy_email, admin[0]._id)
                    }
                  >
                    Send email
                  </Button>
                </div>
              </>
            ) : (
              <div></div>
            )}
          </Box>
          <Button onClick={handleClose} color="error" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default DetailedInfo;
