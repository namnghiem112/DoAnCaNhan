import * as React from "react";
import { Grid, TextField, Button, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../../Redux/Auth/Action"; // Import action

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((store) => store.auth);

  const handleCloseSnackBar = () => setOpenSnackBar(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) {
      setSnackbarMessage("Please enter a valid email address.");
      setSeverity("error");
      setOpenSnackBar(true);
      return;
    }

    // Dispatch forgotPassword action
    dispatch(forgotPassword(email))
      .then(() => {
        setSnackbarMessage("Password reset email sent successfully!");
        setSeverity("success");
        setOpenSnackBar(true);
        setTimeout(() => navigate("/reset"), 3000); // Chuyển đến trang /reset sau 3 giây
      })
      .catch(() => {
        setSnackbarMessage("Failed to send reset email. Please try again.");
        setSeverity("error");
        setOpenSnackBar(true);
      });
  };

  return (
    <div className="shadow-lg">
      <form className="w-full" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="email"
              name="email"
              label="Enter your email"
              fullWidth
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              className="bg-[#d82e4d] w-full"
              type="submit"
              variant="contained"
              size="large"
              sx={{ padding: ".8rem 0" }}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Email"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
