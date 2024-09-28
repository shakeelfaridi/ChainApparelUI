import { createStore } from "redux";

// Redux persist
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
//  ^^^ Redux persist
import rootReducer from "./redux/reducers/RootReducer";

const persistConfig = {
  key: "userData",
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const persistor = persistStore(store);
export { store, persistor };
