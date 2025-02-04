import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import api, { API_BASE_URL } from "../../../config/api";

const RevenueByCategory = () => {
  const [revenueData, setRevenueData] = useState([]);

  const fetchRevenueData = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      const response = await axios.get(
        `${API_BASE_URL}/api/revenue/by-category`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      setRevenueData(response.data);
    } catch (error) {
      console.error("Error fetching revenue by category:", error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const getChartData = () => {
    const labels = revenueData.map((item) => item.categoryName);
    const dataset = revenueData.map((item) => item.totalRevenue);

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: dataset,
          backgroundColor: "#4F46E5",
          borderRadius: 8,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "#4B5563" },
        ticks: { color: "#D1D5DB" },
      },
    },
  };

  return (
    <Card className="bg-gray-800 text-white">
      <CardContent>
        <Typography variant="h6" className="mb-4 text-purple-500">
          Revenue by Category
        </Typography>
        {revenueData.length > 0 ? (
          <Bar data={getChartData()} options={options} height={100} />
        ) : (
          <Typography variant="body1" className="text-gray-400">
            No data available.
          </Typography>
        )}
        <Typography variant="subtitle1" className="mt-4">
          Visualized revenue breakdown by product category 🚀
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RevenueByCategory;
