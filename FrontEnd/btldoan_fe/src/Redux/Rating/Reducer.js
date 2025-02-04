import {
  CREATE_RATING_REQUEST,
  CREATE_RATING_SUCCESS,
  CREATE_RATING_FAILURE,
  GET_PRODUCT_RATINGS_REQUEST,
  GET_PRODUCT_RATINGS_SUCCESS,
  GET_PRODUCT_RATINGS_FAILURE,
} from "./ActionType";

const initialState = {
  ratings: [],
  rating: null,
  loading: false,
  error: null,
};

const ratingReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_RATING_REQUEST:
    case GET_PRODUCT_RATINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_RATING_SUCCESS:
      return {
        ...state,
        loading: false,
        rating: action.payload,
        ratings: [action.payload, ...state.ratings], // Optionally add the new rating to the list
      };

    case GET_PRODUCT_RATINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        ratings: action.payload,
      };

    case CREATE_RATING_FAILURE:
    case GET_PRODUCT_RATINGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default ratingReducer;
