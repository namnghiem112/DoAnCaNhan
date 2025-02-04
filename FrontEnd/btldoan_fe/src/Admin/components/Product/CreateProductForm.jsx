import { useState } from "react";
import { Typography } from "@mui/material";
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../../../Redux/Product/Action";
import { useParams, useNavigate } from "react-router-dom";
const initialSizes = [
  { name: "200ml", quantity: 0 },
  { name: "300ml", quantity: 0 },
  { name: "400ml", quantity: 0 },
];

const CreateProductForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    imageUrl: "",
    title: "",
    brand: "",
    color: "",
    price: "",
    discountPersent: "",
    size: initialSizes,
    quantity: "",
    topLevelCategory: "",
    secondLevelCategory: "",
    thirdLevelCategory: "",
    description: "",
  });
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSizeChange = (e, index) => {
    let { name, value } = e.target;
    name === "size_quantity" ? (name = "quantity") : (name = e.target.name);

    const sizes = [...productData.size];
    sizes[index][name] = value;
    setProductData((prevState) => ({
      ...prevState,
      size: sizes,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true at the start
    setError(null); // Clear any previous errors
    console.log(productData);
    dispatch(createProduct({ data: productData, jwt })) // Dispatch the action
      .then(() => {
        setLoading(false); // Set loading to false after success
        toast.success("Product created successfully!"); // Show success message
        navigate("/admin/products", {
          state: { successMessage: "Product created successfully!" }, // Navigate with success message
        });
      })
      .catch((err) => {
        setLoading(false); // Set loading to false if there's an error
        const errorMessage = err.message || "Something went wrong!"; // Set error message
        setError(errorMessage); // Store the error message in state
        toast.error(errorMessage); // Show error toast
      });
  };

  return (
    <div className="py-2 bg-gray-900">
      <Typography
        variant="h3"
        sx={{ textAlign: "center" }}
        className="py-2 text-center "
      >
        Add New Product
      </Typography>
      <form onSubmit={handleSubmit} className="p-4 min-h-screen">
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
                value={productData.topLevelCategory}
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
                value={productData.secondLevelCategory}
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
                value={productData.thirdLevelCategory}
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
          {productData.size.map((size, index) => (
            <Grid container item spacing={3}>
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
                  name="size_quantity"
                  type="number"
                  onChange={(event) => handleSizeChange(event, index)}
                  required
                  fullWidth
                />
              </Grid>{" "}
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ p: 0.7 }}
              color="primary"
              size="large"
              type="submit"
            >
              Add New Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CreateProductForm;
