import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers } from "../../../Redux/Auth/Action";
import { toast } from "react-toastify";

const NewCustomers = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu khách hàng từ Redux Store
  const { auth } = useSelector((store) => store);
  // const customers = auth?.customers?.content || [];
  const customers = (auth?.customers?.content || []).sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA; // Sắp xếp giảm dần (mới nhất lên đầu)
  });

  // Gọi API để lấy danh sách khách hàng
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        await dispatch(getAllCustomers(jwt, 0, 5)); // Lấy 3 khách hàng đầu tiên
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch customers. Please try again.");
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [dispatch, jwt]);

  return (
    <Card className="bg-gray-800 text-white">
      <CardContent>
        <Typography variant="h6" className="text-purple-500 mb-2">
          New Customers
        </Typography>
        <Typography variant="body2" className="text-right text-blue-500 mt-2">
          <a href="/admin/customers">View All</a>
        </Typography>
        {loading ? (
          <div className="flex justify-center py-4">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="py-2">Image</th>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="py-2">
                    <Avatar
                      src={customer.avatarUrl}
                      alt={customer.name || "No Name"}
                      className="w-8 h-8"
                    />
                  </td>
                  <td className="py-2">
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td className="py-2">{customer.email || "N/A"}</td>
                  <td className="py-2">{customer.createdAt || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};

export default NewCustomers;
