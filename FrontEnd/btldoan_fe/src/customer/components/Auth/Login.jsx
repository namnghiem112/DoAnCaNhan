import * as React from "react";
import { Grid, TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"; // Icon Google
import { FaFacebook } from "react-icons/fa"; // Icon Facebook
import { useDispatch, useSelector } from "react-redux";
import { getUser, login } from "../../../Redux/Auth/Action";
import { useEffect, useState } from "react";

export default function LoginUserForm({ handleNext }) {
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const { auth } = useSelector((store) => store);
  console.log(auth);

  const handleCloseSnakbar = () => setOpenSnackBar(false);

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
    }
  }, [jwt]);

  useEffect(() => {
    if (auth.user || auth.error) setOpenSnackBar(true);
  }, [auth.user, auth.error]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {
      email: data.get("email"),
      password: data.get("password"),
    };
    console.log("login user", userData);
    dispatch(login(userData));
    navigate("/");
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
              label="Email"
              fullWidth
              autoComplete="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="password"
              name="password"
              label="Password"
              fullWidth
              autoComplete="password"
              type="password"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              className="bg-[#d82e4d] w-full"
              type="submit"
              variant="contained"
              size="large"
              sx={{ padding: ".8rem 0" }}
            >
              Login
            </Button>
          </Grid>

          <Grid item xs={12} className="text-center my-4">
            <p className="text-gray-600 text-sm mb-4">Or login using</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8080/oauth2/authorization/google")
                }
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-all"
              >
                <FcGoogle className="text-xl bg-white rounded-full" />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all text-sm">
                <FaFacebook className="text-xl" />
                Facebook
              </button>
            </div>
          </Grid>
        </Grid>
      </form>

      <div className="flex justify-center flex-col items-center">
        <div className="py-3 flex items-center">
          <Button onClick={() => navigate("/register")} size="small">
            Register
          </Button>
          <Button onClick={() => navigate("/forgot")} size="small">
            Forgot Password
          </Button>
        </div>
      </div>

      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnakbar}
      >
        <Alert
          onClose={handleCloseSnakbar}
          severity={auth.error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {auth.error ? auth.error : auth.user ? "Login Success" : ""}
        </Alert>
      </Snackbar>
    </div>
  );
}
