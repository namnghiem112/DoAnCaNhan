import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCustomers,
  deleteUser,
  updateRole,
} from "../../../Redux/Auth/Action";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const CustomersTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  const searchParams = new URLSearchParams(location.search);
  const pageNumber = Number(searchParams.get("page") || 0);
  const pageSize = Number(searchParams.get("size") || 10);
  const sortValue = searchParams.get("sort") || "name_asc";

  const handlePaginationChange = (event, value) => {
    searchParams.set("page", value - 1);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    const data = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      sort: sortValue,
    };

    setLoadingState(true);
    dispatch(getAllCustomers(jwt, data.pageNumber, data.pageSize)).finally(() =>
      setLoadingState(false)
    );
  }, [pageNumber, sortValue, dispatch, jwt]);

  const customersList = auth?.customers?.content || [];

  const handleAddCustomer = () => {
    navigate("/admin/customers/add");
  };

  const handleEditCustomer = (customerId) => {
    navigate(`/admin/customers/edit/${customerId}`);
  };

  const handleDeleteUser = async (customerId) => {
    try {
      await dispatch(deleteUser(customerId, jwt)); // Gọi action deleteUser
      toast.success("Customer deleted successfully!");
      dispatch(getAllCustomers(jwt, pageNumber, pageSize)); // Tải lại danh sách sau khi xóa
    } catch (error) {
      toast.error(
        error.message || "Failed to delete customer. Please try again."
      );
    }
  };

  // Handle update role
  const validRoles = ["ROLE_ADMIN", "ROLE_CUSTOMER"];

  const handleUpdateRole = async (customerId, newRole) => {
    // Kiểm tra vai trò hợp lệ
    if (!validRoles.includes(newRole)) {
      toast.error("Invalid role selected!");
      return;
    }
    if (newRole) {
      const roleData = { role: newRole };
      try {
        await dispatch(updateRole(jwt, customerId, roleData));
        toast.success("Role updated successfully!");
        dispatch(getAllCustomers(jwt, pageNumber, pageSize));
      } catch (error) {
        toast.error(
          error.message || "Failed to update role. Please try again."
        );
      }
    }
  };

  const handleRoleChange = (customerId, event) => {
    const selectedRole = event.target.value;
    handleUpdateRole(customerId, selectedRole);
  };

  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <Box width={"100%"} className="bg-[#0d0d22] min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Card className="pt-2 mb-2" sx={{ flex: "0 0 auto" }}>
        <CardHeader
          title="All Customers"
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          }
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />
      </Card>
      <Card sx={{ flex: "1 1 auto", overflowY: "auto" }}>
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Phone</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Created At</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Role</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customersList.map((customer) => (
                <TableRow hover key={customer.id}>
                  <TableCell>
                    <Avatar alt={customer.firstName} src={customer.avatarUrl} />
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {customer.firstName} {customer.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {customer.mobile || "N/A"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={customer.role?.roleName || ""}
                        onChange={(e) => handleRoleChange(customer.id, e)}
                        label="Role"
                        IconComponent={ArrowDropDownIcon}
                      >
                        <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                        <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>
                        <MenuItem value="ROLE_MODERATOR">Moderator</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditCustomer(customer.id)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteUser(customer.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Card className="mt-2 border">
        <div className="mx-auto px-4 py-5 flex justify-center shadow-lg rounded-md">
          <Pagination
            count={auth?.customers?.totalPages || 1}
            page={pageNumber + 1}
            color="primary"
            onChange={handlePaginationChange}
          />
        </div>
      </Card>
    </Box>
  );
};

export default CustomersTable;
