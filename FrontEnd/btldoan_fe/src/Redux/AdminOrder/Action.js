import axios from "axios";
import {
  GET_ALL_ORDERS_REQUEST,
  GET_ALL_ORDERS_SUCCESS,
  GET_ALL_ORDERS_FAILURE,
  CONFIRM_ORDER_REQUEST,
  CONFIRM_ORDER_SUCCESS,
  CONFIRM_ORDER_FAILURE,
  SHIP_ORDER_REQUEST,
  SHIP_ORDER_SUCCESS,
  SHIP_ORDER_FAILURE,
  DELIVER_ORDER_REQUEST,
  DELIVER_ORDER_SUCCESS,
  DELIVER_ORDER_FAILURE,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAILURE,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
} from "./ActionType";

import { API_BASE_URL } from "../../config/api"; // Base URL cấu hình

// Helper function to configure headers
const getConfig = (jwt) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  },
});

// Get All Orders
export const getAllOrders = (page, size, jwt) => async (dispatch) => {
  dispatch({ type: GET_ALL_ORDERS_REQUEST });
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/api/admin/orders/?page=${page}&size=${size}`,
      getConfig(jwt)
    );
    dispatch({ type: GET_ALL_ORDERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_ALL_ORDERS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Confirm Order
export const confirmOrder = (orderId, jwt) => async (dispatch) => {
  dispatch({ type: CONFIRM_ORDER_REQUEST });
  try {
    const { data } = await axios.put(
      `${API_BASE_URL}/api/admin/orders/${orderId}/confirmed`,
      {}, // Empty object instead of null
      getConfig(jwt)
    );
    dispatch({ type: CONFIRM_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CONFIRM_ORDER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Ship Order
export const shipOrder = (orderId, jwt) => async (dispatch) => {
  dispatch({ type: SHIP_ORDER_REQUEST });
  try {
    const { data } = await axios.put(
      `${API_BASE_URL}/api/admin/orders/${orderId}/ship`,
      {}, // Empty object instead of null
      getConfig(jwt)
    );
    dispatch({ type: SHIP_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SHIP_ORDER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Deliver Order
export const deliverOrder = (orderId, jwt) => async (dispatch) => {
  dispatch({ type: DELIVER_ORDER_REQUEST });
  try {
    const { data } = await axios.put(
      `${API_BASE_URL}/api/admin/orders/${orderId}/deliver`,
      {}, // Empty object instead of null
      getConfig(jwt)
    );
    dispatch({ type: DELIVER_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELIVER_ORDER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Cancel Order
export const cancelOrder = (orderId, jwt) => async (dispatch) => {
  dispatch({ type: CANCEL_ORDER_REQUEST });
  try {
    const { data } = await axios.put(
      `${API_BASE_URL}/api/admin/orders/${orderId}/cancel`,
      {}, // Empty object instead of null
      getConfig(jwt)
    );
    dispatch({ type: CANCEL_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CANCEL_ORDER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete Order
export const deleteOrder = (orderId, jwt) => async (dispatch) => {
  dispatch({ type: DELETE_ORDER_REQUEST });
  try {
    await axios.delete(
      `${API_BASE_URL}/api/admin/orders/${orderId}/delete`,
      getConfig(jwt)
    );
    dispatch({ type: DELETE_ORDER_SUCCESS, payload: orderId });
  } catch (error) {
    dispatch({
      type: DELETE_ORDER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};
