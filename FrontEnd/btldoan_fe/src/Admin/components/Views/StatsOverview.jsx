import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatsOverview = () => {
  return (
    <Card className="bg-gray-800 text-white">
      <CardContent>
        <Typography variant="h6" className="text-purple-500 mb-2">
          Stats Overview
        </Typography>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Typography>Total Profit: $25.6k</Typography>
          </div>
          <div>
            <Typography>Refunds: $78</Typography>
          </div>
          <div>
            <Typography>New Orders: 862</Typography>
          </div>
          <div>
            <Typography>Sales Queries: 15</Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsOverview;
