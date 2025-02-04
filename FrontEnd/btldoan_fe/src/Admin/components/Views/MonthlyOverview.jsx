import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const MonthlyOverview = () => {
  const stats = [
    {
      label: "Sales",
      value: "245k",
      icon: <TrendingUpIcon className="text-purple-500" />,
      color: "bg-purple-500",
    },
    {
      label: "Customers",
      value: "12.5k",
      icon: <PersonIcon className="text-green-500" />,
      color: "bg-green-500",
    },
    {
      label: "Products",
      value: "1.54k",
      icon: <InventoryIcon className="text-orange-500" />,
      color: "bg-orange-500",
    },
    {
      label: "Revenue",
      value: "88k",
      icon: <AttachMoneyIcon className="text-blue-500" />,
      color: "bg-blue-500",
    },
  ];

  return (
    <Card className="bg-gray-800 text-white rounded-lg shadow-md">
      <CardContent className="flex flex-col space-y-4 p-4">
        <Typography variant="h6" className="text-purple-500 mb-4">
          Monthly Overview
        </Typography>
        <Typography variant="subtitle1" className="mb-4">
          Total <span className="text-purple-500">48.5% growth</span> this month
        </Typography>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Box
                className={`flex items-center justify-between p-4 rounded-md ${stat.color} bg-opacity-10`}
              >
                <div className="flex items-center">
                  <div className="mr-4">{stat.icon}</div>
                  <div>
                    <Typography variant="h6">{stat.value}</Typography>
                    <Typography variant="body2">{stat.label}</Typography>
                  </div>
                </div>
                <Typography variant="body2" className="text-right">
                  {Math.random() > 0.5 ? "↗️" : "↘️"}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MonthlyOverview;
