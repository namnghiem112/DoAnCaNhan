// WeeklyOverview.jsx
import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const WeeklyOverview = () => {
  const data = {
    labels: ["", "", "", "", "", "", ""],
    datasets: [
      {
        label: "Sales",
        data: [30, 60, 40, 90, 50, 70, 60],
        backgroundColor: [
          "#A78BFA", // Highlighted bar (e.g., purple)
          "#9CA3AF",
          "#9CA3AF",
          "#9CA3AF",
          "#9CA3AF",
          "#9CA3AF",
          "#9CA3AF",
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#4B5563", // Grid color
        },
        ticks: {
          color: "#D1D5DB", // Tick color
        },
      },
    },
  };

  return (
    <Card className="bg-gray-800 text-white">
      <CardContent>
        <Typography variant="h6" className="mb-4 text-purple-500">
          Weekly Overview
        </Typography>
        <Bar data={data} options={options} height={100} />
        <Typography variant="subtitle1" className="mt-4">
          45% <span className="text-purple-500">better</span> compared to last
          month 🚀
        </Typography>
        <Button
          variant="contained"
          className="bg-purple-500 text-white hover:bg-purple-600 mt-4 w-full"
        >
          DETAILS
        </Button>
      </CardContent>
    </Card>
  );
};

export default WeeklyOverview;
