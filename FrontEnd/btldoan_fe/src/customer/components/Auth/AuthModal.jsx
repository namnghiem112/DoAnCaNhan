import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import RegisterUserForm from "./Register";
import LoginUserForm from "./Login";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ handleClose, open }) {
  const location = useLocation();
  const { auth } = useSelector((store) => store);
  const [currentForm, setCurrentForm] = useState("login");

  useEffect(() => {
    if (auth.user) handleClose();
  }, [auth.user]);

  useEffect(() => {
    if (location.pathname === "/login") setCurrentForm("login");
    else if (location.pathname === "/register") setCurrentForm("register");
    else if (location.pathname === "/forgot") setCurrentForm("forgot");
    else if (location.pathname === "/reset") setCurrentForm("reset");
  }, [location.pathname]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        size="large"
      >
        <Box className="rounded-md" sx={style}>
          {currentForm === "login" && (
            <LoginUserForm onForgotPassword={() => setCurrentForm("forgot")} />
          )}
          {currentForm === "register" && (
            <RegisterUserForm onBackToLogin={() => setCurrentForm("login")} />
          )}
          {currentForm === "forgot" && (
            <ForgotPasswordForm onBackToLogin={() => setCurrentForm("login")} />
          )}
          {currentForm === "reset" && (
            <ResetPasswordForm onBackToLogin={() => setCurrentForm("login")} />
          )}
        </Box>
      </Modal>
    </>
  );
}
