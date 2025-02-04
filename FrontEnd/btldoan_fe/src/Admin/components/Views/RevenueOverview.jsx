import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import api, { API_BASE_URL } from "../../../config/api";
const RevenueOverview = () => {
  const [dataDaily, setDataDaily] = useState({});
  const [dataMonthly, setDataMonthly] = useState({});
  const [dataYearly, setDataYearly] = useState({});
  const [activeView, setActiveView] = useState("daily");

  const fetchRevenueData = async () => {
    try {
      const jwt = localStorage.getItem("jwt");

      // Lấy tháng và năm hiện tại
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // Lưu ý: getMonth() trả về từ 0-11
      const currentYear = today.getFullYear();

      const dailyResponse = await axios.get(
        `${API_BASE_URL}/api/revenue/daily?month=${currentMonth}&year=${currentYear}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      const monthlyResponse = await axios.get(
        `${API_BASE_URL}/api/revenue/monthly?year=${currentYear}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      const yearlyResponse = await axios.get(
        `${API_BASE_URL}/api/revenue/yearly`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      setDataDaily(dailyResponse.data);
      setDataMonthly(monthlyResponse.data);
      setDataYearly(yearlyResponse.data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const getChartData = () => {
    let labels = [];
    let dataset = [];

    if (activeView === "daily") {
      labels = Object.keys(dataDaily).map((day) => `Day ${day}`);
      dataset = Object.values(dataDaily);
    } else if (activeView === "monthly") {
      labels = Object.keys(dataMonthly).map((month) => `Month ${month}`);
      dataset = Object.values(dataMonthly);
    } else if (activeView === "yearly") {
      labels = Object.keys(dataYearly).map((year) => `Year ${year}`);
      dataset = Object.values(dataYearly);
    }

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
          Revenue Overview
        </Typography>
        <div className="flex justify-between mb-4">
          <Button
            variant={activeView === "daily" ? "contained" : "text"}
            className={`${
              activeView === "daily"
                ? "bg-purple-500 text-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveView("daily")}
          >
            Daily
          </Button>
          <Button
            variant={activeView === "monthly" ? "contained" : "text"}
            className={`${
              activeView === "monthly"
                ? "bg-purple-500 text-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveView("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={activeView === "yearly" ? "contained" : "text"}
            className={`${
              activeView === "yearly"
                ? "bg-purple-500 text-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveView("yearly")}
          >
            Yearly
          </Button>
        </div>
        <Bar data={getChartData()} options={options} height={100} />
        <Typography variant="subtitle1" className="mt-4">
          Dynamic revenue visualization based on selected view 🚀
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RevenueOverview;
