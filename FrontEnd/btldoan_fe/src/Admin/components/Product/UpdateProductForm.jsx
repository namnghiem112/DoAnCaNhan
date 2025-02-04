import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho react-toastify
import { useDispatch, useSelector } from "react-redux";
import { findProductById, updateProduct } from "../../../Redux/Product/Action";
import { useParams, useNavigate } from "react-router-dom";

const initialSizes = [
  { name: "30ml", quantity: 0 },
  { name: "50ml", quantity: 0 },
];

const UpdateProductForm = () => {
  const [productData, setProductData] = useState({
    imageUrl: "",
    brand: "",
    title: "",
    color: "",
    price: "",
    discountPersent: "",
    sizes: initialSizes,
    quantity: "",
    topLevelCategory: "",
    secondLevelCategory: "",
    thirdLevelCategory: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { productId } = useParams();
  const { customersProduct } = useSelector((store) => store);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSizeChange = (e, index) => {
    const { name, value } = e.target;
    const sizes = [...productData.sizes];
    sizes[index][name] = value;
    setProductData((prevState) => ({
      ...prevState,
      sizes,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    dispatch(updateProduct({ data: productData, jwt }))
      .then(() => {
        setLoading(false);
        toast.success("Product updated successfully!");
        navigate("/admin/products", {
          state: { successMessage: "Product updated successfully!" },
        });
      })
      .catch((err) => {
        setLoading(false);
        const errorMessage = err.message || "Something went wrong!";
        setError(errorMessage);
        toast.error(errorMessage);
      });
  };

  useEffect(() => {
    dispatch(findProductById({ productId }));
  }, [productId]);

  useEffect(() => {
    if (customersProduct.product) {
      // Cập nhật dữ liệu của sản phẩm
      setProductData((prev) => ({
        ...prev,
        ...customersProduct.product,
        topLevelCategory:
          customersProduct.product?.category?.parentCategory?.parentCategory
            ?.name || "",
        secondLevelCategory:
          customersProduct.product?.category?.parentCategory?.name || "",
        thirdLevelCategory: customersProduct.product?.category?.name || "",
      }));
    }
  }, [customersProduct.product]);

  return (
    <div className="py-2 bg-gray-900">
      <ToastContainer /> {/* Container để hiển thị thông báo */}
      <Typography
        variant="h3"
        sx={{ textAlign: "center" }}
        className="py-10 text-center"
      >
        Update Product
      </Typography>
      <form onSubmit={handleSubmit} className="py-2 min-h-screen">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={productData.imageUrl}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={productData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Color"
              name="color"
              value={productData.color}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Discount Percentage"
              name="discountPersent"
              value={productData.discountPersent}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Top Level Category</InputLabel>
              <Select
                name="topLevelCategory"
                value={productData.topLevelCategory || ""}
                onChange={handleChange}
                label="Top Level Category"
              >
                <MenuItem value="MakeupRemover">Tẩy trang</MenuItem>
                <MenuItem value="Cleanser">Sữa rửa mặt</MenuItem>
                <MenuItem value="Mask">Mặt nạ</MenuItem>
                <MenuItem value="Toner">Nước hoa hồng</MenuItem>
                <MenuItem value="Serum">Tinh chất (Serum)</MenuItem>
                <MenuItem value="Moisturizer">Kem dưỡng ẩm</MenuItem>
                <MenuItem value="BodyLotion">Dưỡng thể</MenuItem>
                <MenuItem value="Makeup">Trang điểm</MenuItem>
                <MenuItem value="HairCare">Chăm sóc tóc</MenuItem>
                <MenuItem value="Perfume">Nước hoa</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Second Level Category</InputLabel>
              <Select
                name="secondLevelCategory"
                value={productData.secondLevelCategory || ""}
                onChange={handleChange}
                label="Second Level Category"
              >
                <MenuItem value="skincare">Chăm sóc da</MenuItem>
                <MenuItem value="makeup">Trang điểm</MenuItem>
                <MenuItem value="haircare">Chăm sóc tóc</MenuItem>
                <MenuItem value="bodycare">Chăm sóc cơ thể</MenuItem>
                <MenuItem value="fragrances">Nước hoa</MenuItem>
                <MenuItem value="health_and_wellness">
                  Sức khỏe & Thể chất
                </MenuItem>
                <MenuItem value="tools_and_accessories">
                  Dụng cụ & Phụ kiện
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Third Level Category</InputLabel>
              <Select
                name="thirdLevelCategory"
                value={productData.thirdLevelCategory || ""}
                onChange={handleChange}
                label="Third Level Category"
              >
                <MenuItem value="facewash">Sữa rửa mặt</MenuItem>
                <MenuItem value="moisturizer">Kem dưỡng ẩm</MenuItem>
                <MenuItem value="serum">Tinh chất (Serum)</MenuItem>
                <MenuItem value="shampoo">Dầu gội</MenuItem>
                <MenuItem value="conditioner">Dầu xả</MenuItem>
                <MenuItem value="bodywash">Sữa tắm</MenuItem>
                <MenuItem value="lotion">Dưỡng thể</MenuItem>
                <MenuItem value="foundation">Kem nền</MenuItem>
                <MenuItem value="lipstick">Son môi</MenuItem>
                <MenuItem value="eyeshadow">Phấn mắt</MenuItem>
                <MenuItem value="mascara">Mascara</MenuItem>
                <MenuItem value="perfume_spray">Nước hoa xịt</MenuItem>
                <MenuItem value="essential_oil">Tinh dầu</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="outlined-multiline-static"
              label="Description"
              multiline
              name="description"
              rows={3}
              onChange={handleChange}
              value={productData.description}
            />
          </Grid>
          {productData?.sizes.map((size, index) => (
            <Grid container item spacing={3} key={index}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Size Name"
                  name="name"
                  value={size.name}
                  onChange={(event) => handleSizeChange(event, index)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={size.quantity}
                  onChange={(event) => handleSizeChange(event, index)}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ p: 1.8 }}
              className="py-20"
              size="large"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default UpdateProductForm;
