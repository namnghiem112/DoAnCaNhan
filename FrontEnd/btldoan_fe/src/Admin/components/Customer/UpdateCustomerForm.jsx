import { useState, useEffect } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../../Redux/Auth/Action"; // Assuming you have a Redux action to update customer
import { useNavigate, useParams } from "react-router-dom";

const UpdateCustomerForm = () => {
  const { customerId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { auth } = useSelector((store) => store); // Assuming customers data is in store
  const [customerData, setCustomerData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    mobile: "",
    gender: "",
    birthDate: "",
  });
  const customers = auth?.customers?.content || [];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  function convertDateFormat(dateString) {
    if (!dateString) return ""; // If no birthDate, return empty string
    const [day, month, year] = dateString.split("/"); // Tách chuỗi dd/mm/yyyy
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`; // Trả về yyyy-MM-dd
  }
  useEffect(() => {
    // Assuming you fetch the customer's data when the form loads
    const customer = customers.find((c) => c.id == customerId);
    console.log("Day");
    console.log(customers);
    console.log("Id" + customerId);
    console.log(customer);
    if (customer) {
      setCustomerData({
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        mobile: customer.mobile,
        gender: customer.gender,
        birthDate: convertDateFormat(customer.birthDate),
      });
    }
  }, [customerId, customers]);

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

    // Only send the fields that are updated
    const updatedCustomer = {
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      mobile: customerData.mobile,
      gender: customerData.gender,
      birthDate: customerData.birthDate,
    };
    // console.log(customerData.birthDate);
    dispatch(
      updateUser(localStorage.getItem("jwt"), customerId, updatedCustomer)
    )
      .then(() => {
        setLoading(false);
        toast.success("Customer updated successfully!");
        navigate("/admin/customers", {
          state: { successMessage: "Customer updated successfully!" },
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
    <div className="py-2 bg-gray-900 flex justify-center flex-col">
      <ToastContainer />
      <Typography
        variant="h3"
        sx={{ textAlign: "center" }}
        className="py-10 text-center"
      >
        Update Customer
      </Typography>
      <form
        onSubmit={handleSubmit}
        className="py-2 min-h-screen w-full max-w-4xl mx-auto"
      >
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={customerData.email}
              disabled // Ngăn người dùng chỉnh sửa và không cho phép focus
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={customerData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={customerData.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mobile"
              name="mobile"
              value={customerData.mobile}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Gender"
              name="gender"
              value={customerData.gender}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Birth Date"
              name="birthDate"
              value={customerData.birthDate}
              onChange={handleChange}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="DD/MM/YYYY"
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              sx={{ p: 1.8 }}
              size="large"
              type="submit"
              disabled={loading}
              fullWidth
            >
              {loading ? "Updating..." : "Update Customer"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default UpdateCustomerForm;
