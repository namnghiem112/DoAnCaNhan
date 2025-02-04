import * as React from "react";
import {
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../../Redux/Auth/Action";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifyKey, setVerifyKey] = useState(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isLoading: isActionLoading, error } = useSelector(
    (store) => store.auth
  );

  // Lấy verifyKey từ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const key = params.get("verifyKey");
    setVerifyKey(key);
  }, [location.search]);

  // Nếu không có verifyKey, hiển thị icon loading trong 1 phút
  useEffect(() => {
    if (!verifyKey) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false); // Dừng loading sau 1 phút
      }, 60000); // 1 phút (60000 ms)

      return () => clearTimeout(timer); // Cleanup timer nếu component bị unmount
    }
  }, [verifyKey]);

  const handleCloseSnackBar = () => setOpenSnackBar(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!verifyKey) {
      setSnackbarMessage("Please verify your email first.");
      setSeverity("error");
      setOpenSnackBar(true);
      return;
    }

    if (!password || !confirmPassword) {
      setSnackbarMessage("Please fill out all fields.");
      setSeverity("error");
      setOpenSnackBar(true);
      return;
    }

    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match.");
      setSeverity("error");
      setOpenSnackBar(true);
      return;
    }

    // Dispatch resetPassword action
    dispatch(resetPassword({ password, verifyKey }))
      .then(() => {
        setSnackbarMessage("Password reset successfully!");
        setSeverity("success");
        setOpenSnackBar(true);
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch(() => {
        setSnackbarMessage(
          error || "Failed to reset password. Please try again."
        );
        setSeverity("error");
        setOpenSnackBar(true);
      });
  };

  // Nếu không có verifyKey, hiển thị thông báo yêu cầu xác nhận email hoặc icon loading
  if (!verifyKey) {
    return (
      <div className="shadow-lg p-4">
        <Alert severity="error">
          Please verify your email before resetting your password.
        </Alert>
        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <CircularProgress />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="shadow-lg">
      <form className="w-full" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="password"
              name="password"
              label="New Password"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isActionLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm New Password"
              fullWidth
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isActionLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              className="bg-[#d82e4d] w-full"
              type="submit"
              variant="contained"
              size="large"
              sx={{ padding: ".8rem 0" }}
              disabled={isActionLoading}
            >
              {isActionLoading ? "Resetting..." : "Reset Password"}
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
