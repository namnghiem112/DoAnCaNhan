import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { ThemeProvider } from "@emotion/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Route, Routes, useNavigate } from "react-router-dom";
import { customTheme } from "../../../customer/them/customeThem";
import Dashboard from "../Views/Dashboard";
import MonthlyOverview from "../Views/MonthlyOverview";
import NewCustomers from "../Views/NewCustomers";
import RecentOrders from "../Views/RecentOrders";
import StatsOverview from "../Views/StatsOverview";
import TotalEarnings from "../Views/TotalEarnings";
import WeeklyOverview from "../Views/WeeklyOverview";
import ProductsTable from "../Product/ProductsTable";
import CreateProductForm from "../Product/CreateProductForm";
import UpdateProductForm from "../Product/UpdateProductForm";
import { Link } from "react-router-dom";
import CustomerTable from "../Customer/CustomerTable";
import UpdateCustomerForm from "../Customer/UpdateCustomerForm";
import CreateCustomerForm from "../Customer/CreateCustomerForm";
import OrderTable from "../Order/OrderTable";

const drawerWidth = 240;

const menu = [
  { name: "Dashboard", path: "/admin" },
  { name: "Dashboard", path: "/admin" },
  { name: "Products", path: "/admin/products" },
  { name: "Customers", path: "/admin/customers" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Add Product", path: "/admin/products/add" },
];

export default function HomePage() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [sideBarVisible, setSideBarVisible] = React.useState(false);
  const navigate = useNavigate();

  const handleSideBarViewInMobile = () => {
    setSideBarVisible(true);
  };

  const handleCloseSideBar = () => {
    setSideBarVisible(false);
  };

  const drawerVariant = isLargeScreen ? "permanent" : "temporary";

  const drawer = (
    <Box
      sx={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <List>
        {menu.map((item, index) => (
          <ListItem
            key={item.name}
            disablePadding
            onClick={() => navigate(item.path)}
          >
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Account", "Request"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer
          variant={drawerVariant}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open={isLargeScreen || sideBarVisible}
          onClose={handleCloseSideBar}
        >
          {drawer}
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductsTable />}></Route>
            <Route path="/products/add" element={<CreateProductForm />}></Route>
            <Route
              path="/products/edit/:productId"
              element={<UpdateProductForm />}
            ></Route>
            <Route path="/customers" element={<CustomerTable />}></Route>
            <Route
              path="/customers/edit/:customerId"
              element={<UpdateCustomerForm />}
            ></Route>
            <Route
              path="/customers/add"
              element={<CreateCustomerForm />}
            ></Route>
            <Route path="/orders" element={<OrderTable />}></Route>
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
