import { combineReducers } from "redux";

import { AuthUser } from "./AuthReducer";
const rootReducer = combineReducers({ AuthUser });

export default rootReducer;
