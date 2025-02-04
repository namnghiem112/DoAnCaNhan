import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Auth/Reducer";
import customerProductReducer from "./Product/Reducer";
import cartReducer from "./Cart/Reducer";
import orderReducer from "./Order/Reducer";
import orderAdminReducer from "./AdminOrder/Reducer";
import ratingReducer from "./Rating/Reducer";
import reviewReducer from "./Review/Reducer";
const rootReducers = combineReducers({
  auth: authReducer,
  customersProduct: customerProductReducer,
  cart: cartReducer,
  order: orderReducer,
  orderAdmin: orderAdminReducer,
  ratingReducer: ratingReducer,
  reviewReducer: reviewReducer,
});

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));
