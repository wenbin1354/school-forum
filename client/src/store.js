import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./features/user";
import majorReducer from "./features/major";
import electiveReducer from "./features/electives";
import commentReducer from "./features/comments";
import requestReducer from "./features/requests";

const reducer = combineReducers({
  currentUser: userReducer,
  majorList: majorReducer,
  electiveList: electiveReducer,
  commentList: commentReducer,
  requestList: requestReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["navigate"],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
