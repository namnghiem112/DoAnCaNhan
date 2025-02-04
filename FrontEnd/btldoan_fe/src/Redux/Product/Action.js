import axios from "axios";

import {
  FIND_PRODUCTS_BY_CATEGORY_REQUEST,
  FIND_PRODUCTS_BY_CATEGORY_SUCCESS,
  FIND_PRODUCTS_BY_CATEGORY_FAILURE,
  FIND_PRODUCT_BY_ID_REQUEST,
  FIND_PRODUCT_BY_ID_SUCCESS,
  FIND_PRODUCT_BY_ID_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  SEARCH_PRODUCT_REQUEST,
  SEARCH_PRODUCT_SUCCESS,
  SEARCH_PRODUCT_FAILURE,
  CREATE_PRODUCT_LIST_REQUEST,
  CREATE_PRODUCT_LIST_SUCCESS,
  CREATE_PRODUCT_LIST_FAILURE,
} from "./ActionType";
import api, { API_BASE_URL } from "../../config/api";

export const findProducts = (reqData) => async (dispatch) => {
  const {
    colors,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    category,
    stock,
    sort,
    pageNumber,
    pageSize,
  } = reqData;

  try {
    dispatch({ type: FIND_PRODUCTS_BY_CATEGORY_REQUEST });

    const { data } = await api.get(
      `/api/products?color=${colors}&size=${sizes}&minPrice=${minPrice}&maxPrice=${maxPrice}&minDiscount=${minDiscount}&category=${category}&stock=${stock}&sort=${sort}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    console.log("get product by category - ", data);
    dispatch({
      type: FIND_PRODUCTS_BY_CATEGORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FIND_PRODUCTS_BY_CATEGORY_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const findProductById = (reqData) => async (dispatch) => {
  try {
    // Kiểm tra xem reqData.productId có hợp lệ không
    if (!reqData || !reqData.productId) {
      console.error("Product ID is missing or invalid in the request data");
      dispatch({
        type: FIND_PRODUCT_BY_ID_FAILURE,
        payload: "Product ID is missing or invalid",
      });
      return; // Dừng việc thực thi tiếp nếu productId không hợp lệ
    }

    dispatch({ type: FIND_PRODUCT_BY_ID_REQUEST });

    // Thực hiện API request
    const { data } = await api.get(`/api/products/id/${reqData.productId}`);
    console.log("Product data received:", data);

    dispatch({
      type: FIND_PRODUCT_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    // Xử lý lỗi khi API request thất bại
    console.error("Error fetching product by ID:", error);

    dispatch({
      type: FIND_PRODUCT_BY_ID_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const searchProduct = (keyword) => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_PRODUCT_REQUEST });

    const { data } = await api.get(`/api/products/search?query=${keyword}`, {
      params: {
        q: keyword,
      },
    });

    console.log("products by  id : ", data);
    dispatch({
      type: SEARCH_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SEARCH_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PRODUCT_REQUEST });

    // Gửi JWT trong header
    const { data } = await api.post(
      `${API_BASE_URL}/api/admin/add`,
      product.data,
      {
        headers: {
          Authorization: `Bearer ${product.jwt}`, // Gửi JWT vào header Authorization
        },
      }
    );

    dispatch({
      type: CREATE_PRODUCT_SUCCESS,
      payload: data,
    });

    console.log("created product ", data);
  } catch (error) {
    dispatch({
      type: CREATE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    console.log(product);
    // Gửi JWT trong header
    const { data } = await api.put(
      `${API_BASE_URL}/api/admin/update/${product.data.id}`,
      product.data,
      {
        headers: {
          Authorization: `Bearer ${product.jwt}`, // Gửi JWT vào header Authorization
        },
      }
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProduct = (productId, jwt) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    // Gửi JWT trong header
    const { data } = await api.delete(`/api/admin/delete/${productId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`, // Gửi JWT vào header Authorization
      },
    });

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data,
    });

    console.log("Product deleted ", data);
  } catch (error) {
    console.log("Catch error ", error);
    dispatch({
      type: DELETE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    // Ném lỗi ra ngoài để hàm gọi biết yêu cầu đã thất bại
    throw new Error(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
};

export const createProductList = (productList, jwt) => async (dispatch) => {
  try {
    // Validate product list before sending
    if (!Array.isArray(productList) || productList.length === 0) {
      console.error("Invalid product list");
      dispatch({
        type: CREATE_PRODUCT_LIST_FAILURE,
        payload: "Product list is invalid",
      });
      return;
    }

    dispatch({ type: CREATE_PRODUCT_LIST_REQUEST });

    const response = await fetch("http://localhost:8080/api/admin/creates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(productList),
    });

    const data = await response.json();

    if (data.status) {
      dispatch({
        type: CREATE_PRODUCT_LIST_SUCCESS,
        payload: data.message,
      });
      console.log("Products created successfully:", data.message);
    } else {
      throw new Error(data.message || "Failed to create products");
    }
  } catch (error) {
    console.error("Error creating product list:", error);
    dispatch({
      type: CREATE_PRODUCT_LIST_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
