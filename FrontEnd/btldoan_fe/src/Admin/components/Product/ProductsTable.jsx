import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  findProducts,
  createProductList,
} from "../../../Redux/Product/Action";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

const ProductsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const { customersProduct } = useSelector((store) => store);

  const searchParams = new URLSearchParams(location.search);
  const colorValue = searchParams.get("color") || "";
  const sizeValue = searchParams.get("size") || "";
  const price = searchParams.get("price");
  const discount = searchParams.get("minDiscount") || 0;
  const sortValue = searchParams.get("sort") || "price_low";
  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const stock = searchParams.get("stock") || "in_stock";
  const category = searchParams.get("category") || "";
  const jwt = localStorage.getItem("jwt");

  const handlePaginationChange = (event, value) => {
    searchParams.set("pageNumber", value); // Sử dụng `pageNumber` chính xác
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const [loadingState, setLoadingState] = useState(false);

  const loadProducts = () => {
    const [minPrice, maxPrice] = price
      ? price.split("-").map(Number)
      : [0, 1000000000];

    const data = {
      category: category || param.levelThree || "",
      colors: colorValue,
      sizes: sizeValue,
      minPrice: minPrice || 0,
      maxPrice: maxPrice || 1000000000,
      minDiscount: Number(discount) || 0,
      sort: sortValue,
      pageNumber: pageNumber - 1, // Trang bắt đầu từ 0
      pageSize: 10,
      stock: stock,
    };

    setLoadingState(true);
    dispatch(findProducts(data)).finally(() => setLoadingState(false));
  };

  useEffect(() => {
    loadProducts();
  }, [
    category,
    colorValue,
    sizeValue,
    price,
    discount,
    sortValue,
    pageNumber,
    stock,
    param.levelThree,
    dispatch,
  ]);

  const products = customersProduct?.products?.content || [];

  const handleDeleteProduct = async (productId) => {
    if (!jwt) {
      toast.error("Authentication failed. Please log in.");
      return;
    }

    try {
      await dispatch(deleteProduct(productId, jwt));
      toast.success("Product deleted successfully!");
      loadProducts();
    } catch (error) {
      toast.error("Failed to delete product. Please try again.");
    }
  };

  const handleAddProduct = () => {
    navigate("/admin/products/add");
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleImportExcel = async (event) => {
    const file = event.target.files[0];
    const fileInput = event.target;
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const productSheetName = "Product Information";
      const sizeSheetName = "Size Information";

      const productSheet = workbook.Sheets[productSheetName];
      const sizeSheet = workbook.Sheets[sizeSheetName];

      if (!productSheet || !sizeSheet) {
        toast.error("Invalid Excel file structure. Please check your file.");
        return;
      }

      const products = XLSX.utils.sheet_to_json(productSheet);
      const sizes = XLSX.utils.sheet_to_json(sizeSheet);

      // Map product data
      const result = products.map((product) => {
        const productSizes = sizes
          .filter((size) => size["STT"] === product["STT"])
          .map((size) => ({
            name: size["Size Name"],
            quantity: size["Size Quantity"],
          }));

        return {
          brand: product["Brand"],
          color: product["Color"],
          description: product["Description"],
          discountPersent: Number(product["Discount Percent"]) || 0,
          imageUrl: product["Image URL"] || "",
          price: product["Price"],
          quantity: product["Quantity"],
          topLevelCategory: product["Top Level Category"],
          secondLevelCategory: product["Second Level Category"],
          thirdLevelCategory: product["Third Level Category"],
          title: product["Title"],
          size: productSizes,
        };
      });
      console.log(result);
      try {
        const jwt = localStorage.getItem("jwt");
        await dispatch(createProductList(result, jwt)); // Call Redux action
        toast.success("Products imported successfully!");
        loadProducts();
      } catch (error) {
        console.error("Import error:", error);
        toast.error(
          `Failed to import products: ${error.message || "Unknown error"}`
        );
      } finally {
        // Reset input value to allow re-importing the same file
        fileInput.value = null;
      }
    };

    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <Box width={"100%"} className="bg-[#0d0d22] min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} />
      <Card className="pt-2 mb-2" sx={{ flex: "0 0 auto" }}>
        <CardHeader
          title="All Products"
          action={
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddProduct}
                sx={{ mr: 2 }}
              >
                Add Product
              </Button>
              <Button variant="contained" component="label">
                Import Products
                <input
                  type="file"
                  hidden
                  accept=".xls,.xlsx"
                  onChange={handleImportExcel}
                />
              </Button>
            </Box>
          }
          sx={{ pt: 2, "& .MuiCardHeader-action": { mt: 0.6 } }}
        />
      </Card>
      <Card sx={{ flex: "1 1 auto", overflowY: "auto" }}>
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Category</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Price</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Quantity</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((item) => (
                <TableRow
                  hover
                  key={item.id}
                  sx={{ "&:last-of-type td, &:last-of-type th": { border: 0 } }}
                >
                  <TableCell>
                    <Avatar alt={item.title} src={item.imageUrl} />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption">{item.brand}</Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.category?.name || "N/A"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.discountedPrice?.toLocaleString()}₫
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditProduct(item.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteProduct(item.id)}
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
        <Box className="mx-auto px-4 py-5 flex justify-center">
          <Pagination
            count={customersProduct.products?.totalPages || 1}
            color="primary"
            page={pageNumber}
            onChange={handlePaginationChange}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default ProductsTable;
