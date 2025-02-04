import React from "react";
import MonthlyOverview from "./MonthlyOverview";
import WeeklyOverview from "./WeeklyOverview";
import TotalEarnings from "./TotalEarnings";
import StatsOverview from "./StatsOverview";
import NewCustomers from "./NewCustomers";
import RecentOrders from "./RecentOrders";
import RevenueOverview from "./RevenueOverview";
import RevenueByCategory from "./RevenueByCategory";

const Dashboard = () => {
  return (
    <div className="bg-gray-900 text-white p-4 grid gap-4 min-h-screen">
      {/* First row with a fixed height of 200px */}
      <div className="grid grid-cols-1 gap-4">
        <RevenueOverview />
      </div>

      {/* Second row takes up the remaining space */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <WeeklyOverview />
        <RevenueByCategory />
        <StatsOverview />
      </div>

      {/* Third row with a fixed height of 300px */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <NewCustomers />
        </div>
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
