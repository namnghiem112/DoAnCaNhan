import {
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAILURE,
  GET_PRODUCT_REVIEWS_REQUEST,
  GET_PRODUCT_REVIEWS_SUCCESS,
  GET_PRODUCT_REVIEWS_FAILURE,
} from "./ActionType";

const initialState = {
  reviews: [],
  review: null,
  loading: false,
  error: null,
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REVIEW_REQUEST:
    case GET_PRODUCT_REVIEWS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        review: action.payload,
        reviews: [action.payload, ...state.reviews], // Optionally add the new review to the list
      };

    case GET_PRODUCT_REVIEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        reviews: action.payload,
      };

    case CREATE_REVIEW_FAILURE:
    case GET_PRODUCT_REVIEWS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default reviewReducer;
