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

const initialState = {
  orders: [],
  loading: false,
  error: null,
  confirmed: null,
  shipped: null,
  delivered: null,
  canceled: null,
};

const orderAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    // Get All Orders
    case GET_ALL_ORDERS_REQUEST:
      return { ...state, loading: true };
    case GET_ALL_ORDERS_SUCCESS:
      return { ...state, loading: false, orders: action.payload, error: null };
    case GET_ALL_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Confirm Order
    case CONFIRM_ORDER_REQUEST:
      return { ...state, loading: true };
    case CONFIRM_ORDER_SUCCESS:
      return { ...state, loading: false, confirmed: action.payload };
    case CONFIRM_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Ship Order
    case SHIP_ORDER_REQUEST:
      return { ...state, loading: true };
    case SHIP_ORDER_SUCCESS:
      return { ...state, loading: false, shipped: action.payload };
    case SHIP_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Deliver Order
    case DELIVER_ORDER_REQUEST:
      return { ...state, loading: true };
    case DELIVER_ORDER_SUCCESS:
      return { ...state, loading: false, delivered: action.payload };
    case DELIVER_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Cancel Order
    case CANCEL_ORDER_REQUEST:
      return { ...state, loading: true };
    case CANCEL_ORDER_SUCCESS:
      return { ...state, loading: false, canceled: action.payload };
    case CANCEL_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Delete Order
    case DELETE_ORDER_REQUEST:
      return { ...state, loading: true };
    case DELETE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: state.orders.filter((order) => order.id !== action.payload),
      };
    case DELETE_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default orderAdminReducer;
