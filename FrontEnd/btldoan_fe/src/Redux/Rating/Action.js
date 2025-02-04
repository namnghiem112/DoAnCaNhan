import axios from "axios";
import {
  CREATE_RATING_REQUEST,
  CREATE_RATING_SUCCESS,
  CREATE_RATING_FAILURE,
  GET_PRODUCT_RATINGS_REQUEST,
  GET_PRODUCT_RATINGS_SUCCESS,
  GET_PRODUCT_RATINGS_FAILURE,
} from "./ActionType";
import api, { API_BASE_URL } from "../../config/api";
// Action to create a rating
export const createRating = (ratingRequest, jwt) => async (dispatch) => {
  dispatch({ type: CREATE_RATING_REQUEST });
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(
      `${API_BASE_URL}/api/ratings/create`,
      ratingRequest,
      config
    );
    dispatch({
      type: CREATE_RATING_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_RATING_FAILURE,
      payload: error.response?.data?.message || "Error while creating rating",
    });
  }
};

// Action to fetch ratings for a product
export const getProductRatings = (productId) => async (dispatch) => {
  dispatch({ type: GET_PRODUCT_RATINGS_REQUEST });
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/ratings/product/${productId}`
    );
    dispatch({
      type: GET_PRODUCT_RATINGS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_PRODUCT_RATINGS_FAILURE,
      payload: error.response?.data?.message || "Error while fetching ratings",
    });
  }
};
