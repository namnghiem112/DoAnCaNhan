import axios from "axios";
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT,
  GET_ALL_CUSTOMERS_REQUEST,
  GET_ALL_CUSTOMERS_SUCCESS,
  GET_ALL_CUSTOMERS_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
} from "./ActionTypes";
import api, { API_BASE_URL } from "../../config/api";

// Register action creators
const registerRequest = () => ({ type: REGISTER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload: user });
const registerFailure = (error) => ({ type: REGISTER_FAILURE, payload: error });

export const register = (userData) => async (dispatch) => {
  // console.log("Hello");
  // console.log(userData);
  dispatch(registerRequest());
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/public/signup`,
      userData
    );
    const user = response.data;
    // if (user.jwt) localStorage.setItem("jwt", user.jwt);
    console.log("registerr :- ", user);
    dispatch(registerSuccess(user));
  } catch (error) {
    console.log("error ", error);
    dispatch(registerFailure(error.message));
  }
};

// Login action creators
const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });

export const login = (userData) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/public/signin`,
      userData
    );
    const user = response.data;
    console.log(user);
    if (user.jwt) localStorage.setItem("jwt", user.jwt);
    console.log("login ", user);
    dispatch(loginSuccess(user));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

//  get user from token
export const getAllCustomers = (token, page, size) => {
  return async (dispatch) => {
    console.log("jwt - ", token);
    dispatch({ type: GET_ALL_CUSTOMERS_REQUEST });
    try {
      // Construct the URL with page and size parameters
      const response = await axios.get(
        `${API_BASE_URL}/api/user/?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const users = response.data;
      dispatch({ type: GET_ALL_CUSTOMERS_SUCCESS, payload: users });
      console.log("All Customers", users);
    } catch (error) {
      const errorMessage = error.message;
      console.log(error);
      dispatch({ type: GET_ALL_CUSTOMERS_FAILURE, payload: errorMessage });
    }
  };
};

export const getUser = (token) => {
  return async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token JWT
          "Content-Type": "application/json", // Đảm bảo header đúng
        },
      });
      const user = response.data;
      dispatch({ type: GET_USER_SUCCESS, payload: user });
      console.log("User Response: ", user);
    } catch (error) {
      console.error("Error fetching user: ", error); // Log lỗi chi tiết
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
    }
  };
};
export const updateUser = (token, userId, userData) => async (dispatch) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/user/update/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_USER_SUCCESS", payload: data });
    } else {
      dispatch({ type: "UPDATE_USER_ERROR", payload: data });
    }
  } catch (error) {
    dispatch({ type: "UPDATE_USER_ERROR", payload: error.message });
  }
};

export const deleteUser = (userId, jwt) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    // Gửi JWT trong header
    const { data } = await api.delete(`/api/user/delete/${userId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`, // Gửi JWT vào header Authorization
      },
    });

    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: data,
    });

    console.log("User deleted", data);
  } catch (error) {
    console.log("Catch error", error);
    dispatch({
      type: DELETE_USER_FAILURE,
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
export const updateRole = (token, userId, roleData) => async (dispatch) => {
  dispatch({ type: "UPDATE_ROLE_REQUEST" });
  try {
    const response = await fetch(
      `http://localhost:8080/api/user/update/role/${userId}`, // API URL để cập nhật vai trò
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token xác thực
        },
        body: JSON.stringify(roleData), // Gửi dữ liệu vai trò mới
      }
    );

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_ROLE_SUCCESS", payload: data });
    } else {
      dispatch({ type: "UPDATE_ROLE_FAILURE", payload: data });
    }
  } catch (error) {
    dispatch({ type: "UPDATE_ROLE_FAILURE", payload: error.message });
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  try {
    const response = await fetch(
      "http://localhost:8080/api/auth/public/forgot",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data });
    } else {
      dispatch({ type: FORGOT_PASSWORD_FAILURE, payload: data });
    }
  } catch (error) {
    dispatch({ type: FORGOT_PASSWORD_FAILURE, payload: error.message });
  }
};

export const resetPassword = (resetData) => async (dispatch) => {
  dispatch({ type: "RESET_PASSWORD_REQUEST" });

  try {
    const response = await fetch(
      `http://localhost:8080/api/auth/public/resetpassword`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData), // Gửi password và verifyKey
      }
    );

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: "RESET_PASSWORD_SUCCESS", payload: data });
    } else {
      dispatch({ type: "RESET_PASSWORD_FAILURE", payload: data });
    }
  } catch (error) {
    dispatch({ type: "RESET_PASSWORD_FAILURE", payload: error.message });
  }
};

export const logout = (token) => {
  return async (dispatch) => {
    dispatch({ type: LOGOUT });
    localStorage.clear();
  };
};
