import { useState } from "react";
import { Typography } from "@mui/material";
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../../Redux/Auth/Action";

const CreateCustomerForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    signUpMethod: "email",
    email: "",
    role: "USER",
    password: "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    dispatch(register(customerData))
      .then(() => {
        setLoading(false);
        toast.success("Customer created successfully!");
        navigate("/admin/customers", {
          state: { successMessage: "Customer created successfully!" },
        });
      })
      .catch((err) => {
        setLoading(false);
        const errorMessage = err.message || "Something went wrong!";
        setError(errorMessage);
        toast.error(errorMessage);
      });
  };

  return (
    <div className="py-2 bg-gray-900">
      <Typography
        variant="h3"
        sx={{ textAlign: "center" }}
        className="py-2 text-center"
      >
        Add New Customer
      </Typography>
      <form onSubmit={handleSubmit} className="p-4 min-h-screen">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={customerData.firstName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={customerData.lastName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={customerData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sign Up Method</InputLabel>
              <Select
                name="signUpMethod"
                value={customerData.signUpMethod}
                onChange={handleChange}
                label="Sign Up Method"
              >
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="social">Social</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={customerData.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={customerData.password}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ p: 0.7 }}
              color="primary"
              size="large"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Add New Customer"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateCustomerForm;
