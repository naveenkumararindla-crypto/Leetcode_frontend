import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../Pages/authslice";
 const store = configureStore({
reducer: {
auth: authReducer

}});

export default store;