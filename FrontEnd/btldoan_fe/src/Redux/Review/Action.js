import axios from "axios";
import {
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAILURE,
  GET_PRODUCT_REVIEWS_REQUEST,
  GET_PRODUCT_REVIEWS_SUCCESS,
  GET_PRODUCT_REVIEWS_FAILURE,
} from "./ActionType";
import api, { API_BASE_URL } from "../../config/api";
// Action to create a review
export const createReview = (reviewRequest, jwt) => async (dispatch) => {
  dispatch({ type: CREATE_REVIEW_REQUEST });
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(
      `${API_BASE_URL}/api/reviews/create`,
      reviewRequest,
      config
    );
    dispatch({
      type: CREATE_REVIEW_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_REVIEW_FAILURE,
      payload: error.response?.data?.message || "Error while creating review",
    });
  }
};

// Action to fetch all reviews for a product
export const getProductReviews = (productId) => async (dispatch) => {
  dispatch({ type: GET_PRODUCT_REVIEWS_REQUEST });
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/reviews/product/${productId}`
    );
    dispatch({
      type: GET_PRODUCT_REVIEWS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_PRODUCT_REVIEWS_FAILURE,
      payload: error.response?.data?.message || "Error while fetching reviews",
    });
  }
};
